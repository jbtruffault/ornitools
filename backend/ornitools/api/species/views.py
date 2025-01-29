from django_filters import rest_framework as filters
from rest_framework.response import Response
from rest_framework import authentication, permissions, serializers, viewsets, status
from ornitools.models import Species
from .serializers import SpeciesSerializer
from rest_framework.permissions import AllowAny

class SpeciesViewSet(viewsets.ModelViewSet):
    queryset = Species.objects.all()
    serializer_class = SpeciesSerializer
    search_fields = ["name", "scientific_name"]
    permission_classes = [AllowAny]