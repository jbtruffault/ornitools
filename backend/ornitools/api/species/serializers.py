from rest_framework import authentication, permissions, serializers, viewsets, status
from ornitools.models import Species


class SpeciesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Species
        fields = ("id", "name", "scientific_name", "description", "conservation_status")