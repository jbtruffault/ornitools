from django.apps import AppConfig


class OrnitoolsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "ornitools"


    def ready(self):
        import ornitools.api.bird.signals
        import ornitools.api.gps_device.signals
        import ornitools.api.gps_file.signals
        import ornitools.api.gps_position.signals
        import ornitools.api.species.signals
