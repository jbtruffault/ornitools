from django_filters import rest_framework as filters
from rest_framework.response import Response
from rest_framework import authentication, permissions, serializers, viewsets, status
from ornitools.models import GPSFile
from .serializers import GPSFileSerializer
from .filters import GPSFileFilter


class GPSFileViewSet(viewsets.ModelViewSet):
    queryset = GPSFile.objects.all()
    serializer_class = GPSFileSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = GPSFileFilter

    def create(self, request, *args, **kwargs):
        # Validation personnalisée avant de créer l'objet
        file = request.FILES.get('file')
        if file:
            if not file.name.endswith('.csv') and not file.name.endswith('.gpx'):
                return Response({"error": "Le fichier doit être au format .csv ou .gpx."}, status=status.HTTP_400_BAD_REQUEST)
            if file.size > 30 * 1024 * 1024:
                return Response({"error": "La taille du fichier ne doit pas dépasser 5 Mo."},
                                status=status.HTTP_400_BAD_REQUEST)

        return super().create(request, *args, **kwargs)