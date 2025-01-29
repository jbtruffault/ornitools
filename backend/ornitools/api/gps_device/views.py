from django_filters import rest_framework as filters
from rest_framework.response import Response
from rest_framework import authentication, permissions, serializers, viewsets, status
from ornitools.models import GPSDevice
from .serializers import GPSDeviceSerializer


class GPSDeviceViewSet(viewsets.ModelViewSet):
    queryset = GPSDevice.objects.all()
    serializer_class = GPSDeviceSerializer
    search_fields = ["name", "model", "manufacturer"]