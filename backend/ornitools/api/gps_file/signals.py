from django.db.models.signals import post_save
from django.dispatch import receiver
from ornitools.models import GPSFile
from .tasks import process_gps_file

@receiver(post_save, sender=GPSFile)
def trigger_gps_file_processing(sender, instance, created, **kwargs):
    if created:
        process_gps_file.delay(instance.id)