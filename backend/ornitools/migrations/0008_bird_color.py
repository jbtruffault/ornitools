# Generated by Django 5.1.2 on 2024-12-17 10:45

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("ornitools", "0007_bird_description"),
    ]

    operations = [
        migrations.AddField(
            model_name="bird",
            name="color",
            field=models.CharField(default="#000080", max_length=7, null=True),
        ),
    ]
