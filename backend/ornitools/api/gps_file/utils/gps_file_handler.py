from rest_framework import serializers
import csv
from io import StringIO
import gpxpy
from datetime import datetime
from django.utils import timezone
import pytz
from ornitools.models import GPSFile, GPSPosition
from django.db import IntegrityError

class GPSFileHandler:
    def get_iostring(self, file):
        try:
            file.seek(0)
            decoded_file = file.read().decode("utf-8")
            if not decoded_file.strip():
                raise serializers.ValidationError("Le fichier est vide ou corrompu.")
            io_string = StringIO(decoded_file)
            io_string.seek(0)
            return io_string
        except Exception as e:
            raise serializers.ValidationError(f"Erreur lors du traitement du fichier : {e}")

    def validate_file(self, file):
        if not file.name.endswith('.csv') and not file.name.endswith('.gpx'):
            raise serializers.ValidationError("Le fichier doit être un .csv ou .gpx.")


        if file.name.endswith('.csv'):
            csv_format = self.identify_csv_format(file)
            reader = self.get_csv_reader(file)

            for i, row in enumerate(reader):
                if i >= 10:
                    break
                self.validate_and_parse_csv_row(row, csv_format)

        elif file.name.endswith('.gpx'):
            self.validate_gpx_file(file)

        # Remettre le pointeur au début pour un traitement ultérieur
        file.seek(0)
        return file

    def get_file_format(self, file):
        if not file.name.endswith('.csv') and not file.name.endswith('.gpx'):
            raise serializers.ValidationError("Le fichier doit être un .csv ou .gpx.")

        # Lire et décoder le contenu
        decoded_file = file.read().decode("utf-8")
        io_string = StringIO(decoded_file)

        if file.name.endswith('.csv'):
            file_extension = "csv"
            file_format = self.identify_csv_format(file)

        elif file.name.endswith('.gpx'):
            file_extension = "gpx"
            file_format = 0

        else:
            file_format = None
            file_format = None

        # Remettre le pointeur au début pour un traitement ultérieur
        file.seek(0)

        return (file_extension, file_format)

    def identify_csv_format(self, file):
        """
        Identifie le format du fichier CSV à partir des en-têtes.
        """
        # Détection automatique du séparateur
        try:
            io_string = self.get_iostring(file)
            dialect = csv.Sniffer().sniff(io_string.read(4096))
            io_string.seek(0)
            reader = csv.DictReader(io_string, delimiter=dialect.delimiter)
            headers = reader.fieldnames
        except csv.Error:
            raise serializers.ValidationError("Impossible de détecter le séparateur dans le fichier CSV.")

        # Lecture des headers

        if not headers:
            raise serializers.ValidationError("Le fichier CSV ne contient pas d'en-têtes.")

        # Identifier le format à partir des headers
        if set(headers) >= {'longitude', 'latitude', 'timestamp'}:
            return 0  # Format 0
        elif set(headers) >= {'Longitude', 'Latitude', 'UTC_datetime'}:
            return 1  # Format 1
        else:
            raise serializers.ValidationError(
                "Les en-têtes du fichier CSV ne correspondent à aucun format pris en charge."
            )

    def get_csv_reader(self, file):
        """
        Retourne un lecteur CSV prêt à l'emploi avec le séparateur détecté.
        """
        try:
            io_string = self.get_iostring(file)
            dialect = csv.Sniffer().sniff(io_string.read(4096))
            io_string.seek(0)
            return csv.DictReader(io_string, delimiter=dialect.delimiter)
        except csv.Error as e:
            raise serializers.ValidationError(f"Impossible de créer un lecteur CSV: {e}")

    @staticmethod
    def validate_and_parse_csv_row(row, file_format):
        """
        Valide et parse une ligne CSV selon le format spécifié.
        """
        if file_format == 0:
            try:
                date_row = datetime.strptime(row["timestamp"], "%Y-%m-%d %H:%M:%S.%f")
            except ValueError:
                date_row = datetime.strptime(row["timestamp"], "%Y-%m-%d %H:%M:%S")

            if float(row["latitude"]) == 0.0 and float(row["longitude"]) == 0.0:
                print(f"Coordonnées du point: 0:0")
                return None

            try:
                return {
                    "latitude": float(row["latitude"]),
                    "longitude": float(row["longitude"]),
                    "timestamp": timezone.make_aware(date_row, pytz.UTC),
                }
            except ValueError as e:
                print(f"Erreur validate_and_parse_csv_row: {e}")
                print(row)
                return None

        elif file_format == 1:
            date_row = datetime.strptime(row["UTC_datetime"], "%Y-%m-%d %H:%M:%S")
            try:
                if row["datatype"] == 'SENSORS':
                    print(f"Datatype: sensors, no GPS coordinates")
                    return None
                if float(row["Latitude"] )== 0.0 and float(row["Longitude"]) == 0.0:
                    print(f"Coordonnées du point: 0:0")
                    return None
                return {
                    "latitude": float(row["Latitude"]),
                    "longitude": float(row["Longitude"]),
                    "timestamp": timezone.make_aware(date_row, pytz.UTC),
                    "altitude_m": int(row["Altitude_m"]),
                    "satcount": int(row["satcount"]),
                    "hdop": float(row["hdop"]),
                    "U_bat_mV": int(row["U_bat_mV"]),
                    "bat_soc_pct": int(row["bat_soc_pct"]),
                    "solar_I_mA": int(row["solar_I_mA"]),
                    "speed_km_h": int(row["speed_km_h"]),
                    "direction_deg": int(row["direction_deg"]),
                    "temperature_C": int(row["temperature_C"]),
                    "mag_x": int(row["mag_x"]),
                    "mag_y": int(row["mag_y"]),
                    "mag_z": int(row["mag_z"]),
                    "acc_x": int(row["acc_x"]),
                    "acc_y": int(row["acc_y"]),
                    "acc_z": int(row["acc_z"]),
                }
            except ValueError as e:
                print(f"Erreur validate_and_parse_csv_row: {e}")
                print(row)
                return None

        print(f"Erreur: format de fichier inconnu")
        raise ValueError(f"Format de fichier inconnu: {file_format}")
        return None

    @staticmethod
    def parse_gpx_point(point):
        """
        Parse et retourne un dictionnaire contenant les informations d'un point GPX.
        """
        voltage, temperature = None, None
        if point.comment or point.description:
            details = (point.comment or point.description).split()
            for detail in details:
                if detail.startswith("Vbat="):
                    voltage = int(detail.replace("Vbat=", ""))
                elif detail.startswith("Temp="):
                    temperature = int(detail.replace("Temp=", ""))

        return {
            "latitude": point.latitude,
            "longitude": point.longitude,
            "altitude_m": point.elevation,
            "timestamp": timezone.make_aware(point.time, pytz.UTC),
            "satcount": getattr(point, 'sat', None),
            "hdop": getattr(point, 'hdop', None),
            "U_bat_mV": voltage,
            "temperature_C": temperature,
        }

    def validate_gpx_file(self, file):
        """
        Valide un fichier GPX en vérifiant chaque point.
        """
        try:
            io_string = self.get_iostring(file)
            gpx = gpxpy.parse(io_string)
            for track in gpx.tracks:
                for segment in track.segments:
                    for i, point in enumerate(segment.points):
                        if i >= 10:
                            break
                        self.is_this_gpx_point_valid(point)
        except Exception as e:
            raise serializers.ValidationError(f"Erreur lors de la lecture du fichier GPX: {e}")

    def is_this_gpx_point_valid(self, point):
        """
        Valide un point GPX. Implémentez ici vos critères de validation.
        """
        # Exemple de validation minimale (à personnaliser)
        if point.latitude is None or point.longitude is None:
            raise serializers.ValidationError("Le point GPX contient des coordonnées manquantes.")

        if point.latitude == 0 and point.longitude == 0:
            raise serializers.ValidationError("Le point GPX est à 0:0")

        return True

    def record_positions_from_file(self, file_id):
        gps_file = GPSFile.objects.get(pk=file_id)
        file = gps_file.file
        (file_extension, file_format) = self.get_file_format(file)

        saved_positions_count = 0

        if file_extension == "csv":
            csv_reader = self.get_csv_reader(file)

            for row in csv_reader:
                parsed_data = self.validate_and_parse_csv_row(row, file_format)
                try:
                    if parsed_data:
                        position = GPSPosition(gps_file=gps_file, **parsed_data)
                        position.save()
                        saved_positions_count += 1
                except IntegrityError as e:
                    position = None
                    print("row", row)
                    print(f"Erreur d'integrité: {e}")
                    continue
                except Exception as e:
                    position = None
                    print("row", row)
                    print(f"Erreur d'importation: {e}")
                    continue

        elif file_extension == "gpx":
            io_string = self.get_iostring(file)
            gpx = gpxpy.parse(io_string)
            for track in gpx.tracks:
                for segment in track.segments:
                    for point in segment.points:
                        if self.is_this_gpx_point_valid(point):
                            parsed_data = self.parse_gpx_point(point)
                            try:
                                if parsed_data:
                                    position = GPSPosition(gps_file=gps_file, **parsed_data)
                                    position.save()
                                    saved_positions_count += 1
                            except IntegrityError as e:
                                position = None
                                print("row", point)
                                print(f"Erreur d'integrité: {e}")
                                continue
                            except Exception as e:
                                position = None
                                print("row", point)
                                print(f"Erreur d'importation: {e}")
                                continue

        return saved_positions_count
