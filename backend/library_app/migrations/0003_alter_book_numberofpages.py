# Generated by Django 3.2.5 on 2023-04-20 08:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('library_app', '0002_auto_20230330_1737'),
    ]

    operations = [
        migrations.AlterField(
            model_name='book',
            name='numberOfPages',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
