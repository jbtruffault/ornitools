# filters.py
import django_filters
from ornitools.models import GPSPosition

class GPSPositionFilter(django_filters.FilterSet):
    gps_file__bird__in = django_filters.BaseInFilter(field_name='gps_file__bird', lookup_expr='in', required=False)
    timestamp__gte = django_filters.DateTimeFilter(field_name='timestamp', lookup_expr='gte', required=False)
    timestamp__lte = django_filters.DateTimeFilter(field_name='timestamp', lookup_expr='lte', required=False)

    def filter_queryset(self, queryset):
        # Vérifier si tous les champs requis sont présents
        required_fields = ['gps_file__bird__in', 'timestamp__gte', 'timestamp__lte']
        missing_fields = [field for field in required_fields if not self.data.get(field)]

        if missing_fields:
            # Si un champ est manquant, retourner une queryset vide
            return queryset.none()

        # Validation des données fournies
        try:
            birds = self.data.get('gps_file__bird__in')
            if birds:
                # Valider si `birds` peut être interprété comme une liste
                bird_ids = [int(bird_id) for bird_id in birds.split(',')]
                if not bird_ids:
                    return queryset.none()

            if self.data.get('timestamp__gte'):
                # Valider si `timestamp__gte` est une date valide
                django_filters.DateTimeFilter().field.clean(self.data['timestamp__gte'])

            if self.data.get('timestamp__lte'):
                # Valider si `timestamp__lte` est une date valide
                django_filters.DateTimeFilter().field.clean(self.data['timestamp__lte'])

        except (ValueError, TypeError):
            # Si une erreur survient dans la validation, renvoyer une réponse vide
            return queryset.none()

        # Si les validations passent, appliquer les filtres normalement
        return super().filter_queryset(queryset)

    class Meta:
        model = GPSPosition
        fields = ['gps_file__bird__in', 'timestamp__gte', 'timestamp__lte']