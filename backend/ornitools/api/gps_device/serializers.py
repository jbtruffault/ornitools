from rest_framework import authentication, permissions, serializers, viewsets, status
from ornitools.models import GPSDevice


class GPSDeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = GPSDevice
        fields = ("id", "name", "model", "manufacturer", "serial_number")