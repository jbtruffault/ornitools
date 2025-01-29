from django.contrib import admin
from .models import *

# Register your models here.
class SpeciesAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {"fields": ["name"]}),
        (None, {"fields": ["scientific_name"]}),
        (None, {"fields": ["description"]}),
        (None, {"fields": ["conservation_status"]})
    ]
    list_display = ["name", "scientific_name", "description", "conservation_status"]
    list_filter = ["conservation_status"]
    search_fields = ["name", "scientific_name"]

class BirdsAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {"fields": ["species"]}),
        (None, {"fields": ["name"]}),
        (None, {"fields": ["given_name"]}),
        (None, {"fields": ["is_public"]}),
        (None, {"fields": ["photo"]})
    ]
    list_display = ["species", "name", "given_name", "is_public"]
    list_filter = ["species", "is_public"]
    search_fields = ["name", "given_name"]

class GPSDeviceAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {"fields": ["name"]}),
        (None, {"fields": ["manufacturer"]}),
        (None, {"fields": ["model"]})
    ]
    list_display = ["name", "model", "manufacturer"]
    list_filter = ["manufacturer", "model"]
    search_fields = ["name"]

class GPSFileAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {"fields": ["bird"]}),
        (None, {"fields": ["gps_device"]}),
        (None, {"fields": ["file"]}),
        (None, {"fields": ["description"]})
    ]

    list_display = ["bird", "gps_device", "description"]
    search_fields = ["bird", "gps_device", "file"]

class GPSPositionAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {"fields": ["gps_file"]}),
        (None, {"fields": ["latitude"]}),
        (None, {"fields": ["longitude"]}),
        (None, {"fields": ["timestamp"]})
    ]
    list_display = ["gps_file", "latitude", "longitude", "timestamp"]
    list_filter = ["latitude", "longitude", "timestamp"]
    search_fields = ["gps_file"]

admin.site.register(Species, SpeciesAdmin)
admin.site.register(Bird, BirdsAdmin)
admin.site.register(GPSDevice, GPSDeviceAdmin)
admin.site.register(GPSFile, GPSFileAdmin)
admin.site.register(GPSPosition, GPSPositionAdmin)
