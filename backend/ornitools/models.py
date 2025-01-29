from django.db import models
from jsonfield import JSONField

class Species(models.Model):
    name = models.CharField(max_length=100, unique=True)
    scientific_name = models.CharField(max_length=150, unique=True)
    description = models.TextField(blank=True, null=True)

    UICN_STATUSES = [
        ('LC', 'Least Concern'),  # Species is widespread and abundant
        ('NT', 'Near Threatened'),  # Close to qualifying for a threatened category
        ('VU', 'Vulnerable'),  # High risk of extinction in the wild
        ('EN', 'Endangered'),  # Very high risk of extinction in the wild
        ('CR', 'Critically Endangered'),  # Extremely high risk of extinction in the wild
        ('EW', 'Extinct in the Wild'),
        # Known only to survive in cultivation, captivity, or as a naturalized population outside its historic range
        ('EX', 'Extinct'),  # No known individuals remaining
        ('DD', 'Data Deficient'),  # Inadequate information to assess the risk of extinction
        ('NE', 'Not Evaluated')  # Has not yet been evaluated against the criteria
    ]

    conservation_status = models.CharField(
        max_length=2,
        choices=UICN_STATUSES,
        blank=True,
        null=True
    )

    class Meta:
        verbose_name = "Species"
        verbose_name_plural = "Species"

    def __str__(self):
        return self.name


class Bird(models.Model):
    species = models.ForeignKey(Species, on_delete=models.CASCADE, related_name='birds')
    name = models.CharField(max_length=100, unique=True)
    given_name = models.CharField(max_length=100, blank=True, null=True)
    is_public = models.BooleanField(default=False, help_text="Indicates if the bird's GPS data should be publicly visible.")
    photo = models.ImageField(upload_to='bird_photos/', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    color = models.CharField(max_length=7, default="#000080", null=True)

    class Meta:
        verbose_name = "Bird"
        verbose_name_plural = "Birds"

    def __str__(self):
        return f"{self.name} ({self.species.name})"


class GPSDevice(models.Model):
    name = models.CharField(max_length=100, unique=True)
    manufacturer = models.CharField(max_length=100, blank=True, null=True)
    model = models.CharField(max_length=100, blank=True, null=True)
    serial_number = models.CharField(max_length=100, blank=True, null=True)
    #battery_life = models.PositiveIntegerField(help_text="Battery life in days", blank=True, null=True)

    class Meta:
        verbose_name = "GPSDevice"
        verbose_name_plural = "GPSDevices"

    def __str__(self):
        return self.name


class GPSFile(models.Model):
    bird = models.ForeignKey(Bird, on_delete=models.CASCADE, related_name='gps_file')
    gps_device = models.ForeignKey(GPSDevice, on_delete=models.CASCADE, related_name='file')
    file = models.FileField(upload_to='gps_files/')
    created_at = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "GPSFile"
        verbose_name_plural = "GPSFiles"
        unique_together = ('bird', 'gps_device', 'file')

    @property
    def first_position_timestamp(self):
        positions = self.positions.all().order_by('timestamp')
        if positions.exists():
            return positions.first().timestamp
        return None

    @property
    def last_position_timestamp(self):
        positions = self.positions.all().order_by('timestamp')
        if positions.exists():
            return positions.last().timestamp
        return None

    @property
    def position_count(self):
        return self.positions.count()


    def __str__(self):
        return f"FILE_{self.bird.name}_{self.gps_device.name}_{self.created_at.strftime('%Y%m%d')}"


class GPSPosition(models.Model):
    gps_file = models.ForeignKey(GPSFile, on_delete=models.CASCADE, related_name='positions', null=True, blank=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    altitude_m = models.IntegerField(null=True, blank=True)
    timestamp = models.DateTimeField()

    # Satellite
    satcount = models.IntegerField(null=True, blank=True)
    hdop = models.FloatField(null=True, blank=True) #Horizontal Dilution of Precision, GPS precision, weaker is the better

    # Batterie
    U_bat_mV = models.IntegerField(null=True, blank=True)
    bat_soc_pct = models.IntegerField(null=True, blank=True)
    solar_I_mA = models.IntegerField(null=True, blank=True)

    # Contexte
    speed_km_h = models.IntegerField(null=True, blank=True)
    direction_deg = models.IntegerField(null=True, blank=True)
    temperature_C = models.IntegerField(null=True, blank=True)

    # Champ magnétique
    mag_x = models.IntegerField(null=True, blank=True)
    mag_y = models.IntegerField(null=True, blank=True)
    mag_z = models.IntegerField(null=True, blank=True)

    # Accélération
    acc_x = models.IntegerField(null=True, blank=True)
    acc_y = models.IntegerField(null=True, blank=True)
    acc_z = models.IntegerField(null=True, blank=True)

    class Meta:
        verbose_name = "GPSPosition"
        verbose_name_plural = "GPSPosition"
        constraints = [
            models.UniqueConstraint(fields=['latitude', 'longitude', 'timestamp', 'altitude_m'], name='unique_gps_position')
        ]


    def __str__(self):
        return f"Position of {self.gps_file.bird.name if self.gps_file else 'Oiseau inconnu'} at {self.timestamp}"
