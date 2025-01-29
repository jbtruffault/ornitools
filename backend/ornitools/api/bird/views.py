from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from ornitools.models import Bird
from .serializers import BirdSerializer
from .filters import BirdFilter
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class BirdViewSet(viewsets.ModelViewSet):
    queryset = Bird.objects.all()
    serializer_class = BirdSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = BirdFilter
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()

        # Check if the user is authenticated
        if self.request.user.is_authenticated:
            return queryset
        else:
            # Filter birds for public birds only
            return queryset.filter(is_public=True)