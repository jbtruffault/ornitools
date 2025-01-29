from django_filters import rest_framework as filters
from rest_framework.response import Response
from rest_framework import authentication, permissions, serializers, viewsets, status
from ornitools.models import GPSFile
from .serializers import GPSFileSerializer


class GPSFileFilter(filters.FilterSet):
    bird_id = filters.NumberFilter(field_name="bird_id", lookup_expr="exact")

    class Meta:
        model = GPSFile
        fields = ['bird_id']