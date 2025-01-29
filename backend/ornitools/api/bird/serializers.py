from rest_framework import authentication, permissions, serializers, viewsets, status
from ornitools.models import Bird, Species


class BirdSerializer(serializers.ModelSerializer):
    species = serializers.PrimaryKeyRelatedField(queryset=Species.objects.all())

    class Meta:
        model = Bird
        fields = ("id", "species", "name", "given_name", "is_public", "photo", "description", "color")

    def create(self, validated_data):
        bird = Bird.objects.create(**validated_data)
        return bird

    def update(self, instance, validated_data):
        # Don't erase photo when it's not defined, keep the old
        print(validated_data.get("color"))
        if not validated_data.get("photo"):
            validated_data.pop("photo", None)
        return super().update(instance, validated_data)
