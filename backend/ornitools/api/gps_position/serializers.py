from rest_framework import serializers
from ornitools.models import GPSPosition
from ornitools.api.gps_file.serializers import GPSFileSerializer

class GPSPositionSerializer(serializers.ModelSerializer):
    gps_file = GPSFileSerializer(read_only=True)

    class Meta:
        model = GPSPosition
        fields = ("id", "gps_file", "latitude", "longitude", "timestamp")