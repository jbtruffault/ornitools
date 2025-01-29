from rest_framework import serializers
from ornitools.models import GPSFile, GPSDevice
from ornitools.api.gps_file.utils.gps_file_handler import GPSFileHandler

import csv
from io import StringIO
from datetime import datetime

import gpxpy

class GPSFileSerializer(serializers.ModelSerializer):
    gps_device = serializers.PrimaryKeyRelatedField(queryset=GPSDevice.objects.all())
    file = serializers.FileField(required=True)
    first_position_timestamp = serializers.DateTimeField(read_only=True)
    last_position_timestamp = serializers.DateTimeField(read_only=True)
    position_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = GPSFile
        fields = ['id', 'bird', 'gps_device', 'file', 'created_at', 'description', 'first_position_timestamp',
                  'last_position_timestamp', 'position_count']

    def validate_file(self, file):
        file_validator = GPSFileHandler()
        file_validator.validate_file(file)

        # Remettre le pointeur au début pour un traitement ultérieur
        file.seek(0)
        return file

    def is_this_row_valid(self, row, csv_format):
        if csv_format == 0:  # Format avec "longitude", "latitude", "timestamp"
            required_keys = ['longitude', 'latitude', 'timestamp']
        elif csv_format == 1:  # Format avec "Longitude", "Latitude", "UTC_datetime"
            required_keys = ['Longitude', 'Latitude', 'UTC_datetime']
        else:
            raise serializers.ValidationError("Format CSV inconnu.")

        for key in required_keys:
            if key not in row or not row[key].strip():
                raise serializers.ValidationError(f"Clé manquante ou vide : {key}")

        # Validation des valeurs spécifiques
        try:
            float(row['longitude' if csv_format == 0 else 'Longitude'])
            float(row['latitude' if csv_format == 0 else 'Latitude'])
            datetime.strptime(
                row['timestamp' if csv_format == 0 else 'UTC_datetime'],
                "%Y-%m-%d %H:%M:%S"
            )
        except ValueError as e:
            raise serializers.ValidationError(f"Erreur de format dans une ligne CSV : {e}")

    def validate_gpx(self, decoded_file):
        """
        Validate GPX file content using gpxpy.
        """
        try:
            gpx = gpxpy.parse(decoded_file)
            if not gpx.tracks:
                raise serializers.ValidationError("Aucune trace trouvée dans le fichier GPX.")

            for track in gpx.tracks:
                for segment in track.segments:
                    for point in segment.points:
                        if not (point.latitude and point.longitude and point.time):
                            raise serializers.ValidationError("Un point de trace contient des données manquantes.")

                        # Validate fields
                        float(point.latitude)
                        float(point.longitude)
                        if not isinstance(point.time, datetime):
                            raise serializers.ValidationError("Horodatage invalide pour un point de trace.")

        except gpxpy.gpx.GPXXMLSyntaxException as e:
            raise serializers.ValidationError(f"Le fichier GPX est mal formaté: {str(e)}")
        except Exception as e:
            raise serializers.ValidationError(f"Erreur dans le fichier GPX: {str(e)}")

