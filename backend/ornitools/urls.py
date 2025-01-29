from django.urls import path, re_path
from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter

from .api.bird.views import BirdViewSet
from .api.species.views import SpeciesViewSet
from .api.gps_position.views import GPSPositionViewSet
from .api.gps_file.views import GPSFileViewSet
from .api.gps_device.views import GPSDeviceViewSet

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register("species", SpeciesViewSet)
router.register("bird", BirdViewSet)
router.register("gps_device", GPSDeviceViewSet)
router.register("gps_file", GPSFileViewSet)
router.register("gps_position", GPSPositionViewSet)

app_name = "api"
urlpatterns = router.urls
