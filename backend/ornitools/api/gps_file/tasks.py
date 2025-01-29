from celery import shared_task
from ornitools.models import GPSFile, GPSPosition
import csv
from io import StringIO
from datetime import datetime
from django.utils import timezone
from core.celery import app
from ornitools.api.gps_file.utils.gps_file_handler import GPSFileHandler


@app.task(ignore_result=True)
def process_gps_file(file_id):
    try:
        file_validator = GPSFileHandler()
        positions_count = file_validator.record_positions_from_file(file_id)
        print(f"{positions_count} positions importées avec succès.")

    except Exception as e:
        print(f"Erreurs lors de l'importation: {e}")
