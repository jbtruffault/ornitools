# filters.py
import django_filters
from ornitools.models import Bird

class BirdFilter(django_filters.FilterSet):
    class Meta:
        model = Bird
        fields = ['is_public']