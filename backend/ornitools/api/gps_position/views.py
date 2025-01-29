from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework import authentication, permissions, serializers, viewsets, status
from ornitools.models import GPSPosition
from .serializers import GPSPositionSerializer
from .filters import GPSPositionFilter
import logging
from datetime import datetime, timezone
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.db.models.functions import Mod
from django.db.models import F, Value
from django.db import connection
from rest_framework.exceptions import ValidationError
from datetime import datetime, timedelta
import pytz

logger = logging.getLogger(__name__)

class GPSPositionViewSet(viewsets.ModelViewSet):
    queryset = GPSPosition.objects.select_related('gps_file', 'gps_file__bird')
    serializer_class = GPSPositionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = GPSPositionFilter
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_positions_with_query_params(self, query_params, user_is_authenticated):
        # Paramètres de la requête
        gps_file_bird_in = query_params.get('gps_file__bird__in', None)
        timestamp_gte = query_params.get('timestamp__gte', None)
        timestamp_lte = query_params.get('timestamp__lte', None)

        if gps_file_bird_in:
            try:
                bird_ids = [int(bid) for bid in gps_file_bird_in[0].split(",")]
            except (ValueError, IndexError):
                raise ValueError("gps_file__bird__in doit être une liste d'entiers au format '1,2,3'")
        else:
            return []

        try:
            timestamp_gte = self.parse_iso_date(timestamp_gte) if timestamp_gte else (
                        datetime.now(pytz.UTC) - timedelta(days=20))
        except (ValueError, IndexError):
            raise ValueError("timestamp__gte doit être une date au format ISO 8601")

        try:
            timestamp_lte = self.parse_iso_date(timestamp_lte) if timestamp_lte else datetime.now(pytz.UTC)
        except (ValueError, IndexError):
            raise ValueError("timestamp__lte doit être une date au format ISO 8601")

        #if timestamp_gte:
        #    timestamp_gte = self.parse_iso_date(timestamp_gte)
        #if timestamp_lte:
        #    timestamp_lte = self.parse_iso_date(timestamp_lte)

        query = """
            SELECT 
                ornitools_gpsposition.longitude, 
                ornitools_gpsposition.latitude, 
                ornitools_gpsposition.timestamp, 
                ornitools_gpsfile.bird_id 
            FROM ornitools_gpsposition
            INNER JOIN ornitools_gpsfile ON ornitools_gpsposition.gps_file_id = ornitools_gpsfile.id
            INNER JOIN ornitools_bird ON ornitools_bird.id = ornitools_gpsfile.bird_id
            WHERE ornitools_gpsposition.timestamp >= '{timestamp_gte}'
            AND ornitools_gpsposition.timestamp <= '{timestamp_lte}'
            AND ornitools_gpsposition.id % 10 = 0
        """.format(timestamp_gte=timestamp_gte, timestamp_lte=timestamp_lte)

        # Ajout des filtres dynamiques
        if gps_file_bird_in:
            query += " AND ornitools_bird.id IN ({gps_file_bird_in})".format(gps_file_bird_in=gps_file_bird_in)

        if not user_is_authenticated:
            query += " AND ornitools_bird.is_public = TRUE"

        # Tri et pagination
        query += " ORDER BY ornitools_gpsposition.timestamp ASC"

        # Exécution de la requête SQL
        with connection.cursor() as cursor:
            cursor.execute(query)
            rows = cursor.fetchall()

        # Retourner les résultats
        return rows

    def get_queryset(self):
        query_params = self.request.query_params
        queryset = super().get_queryset()

        # Récupérer le paramètre ratio, par défaut 200
        try:
            ratio = int(query_params.get('ratio', 200))
            if ratio <= 0:
                raise ValueError
        except ValueError:
            raise ValidationError("Le paramètre 'ratio' doit être un entier positif non nul.")

        # Annoter et filtrer avec Mod
        queryset = queryset.annotate(id_mod=Mod(F('id'), Value(ratio))).filter(id_mod=0)

        # Filtrer par l'authentification de l'utilisateur
        if self.request.user.is_authenticated:
            queryset = self.filter_queryset(queryset)
        else:
            queryset = queryset.filter(gps_file__bird__is_public=True)

        return queryset

    def list(self, request, *args, **kwargs):
        query_params = request.query_params

        details = query_params.get('details', None)
        if details != 'full':
            # Exécuter la requête SQL brute si 'details' n'est pas 'full'
            sql_results = self.get_positions_with_query_params(query_params, request.user.is_authenticated)

            # Créer une liste d'objets simulant un QuerySet Django
            results = [
                {
                    "longitude": row[0],
                    "latitude": row[1],
                    "timestamp": row[2],
                    "gps_file": {"bird": row[3]},
                }
                for row in sql_results
            ]

            # Retourner une réponse avec les résultats
            return Response(results)

        return super().list(request, *args, **kwargs)

    def parse_iso_date(self, date_string):
        # Supprimer le 'Z' pour UTC et ajouter le fuseau horaire UTC manuellement
        if date_string.endswith('Z'):
            date_string = date_string[:-1] + '+00:00'
        return datetime.fromisoformat(date_string).astimezone(timezone.utc)
