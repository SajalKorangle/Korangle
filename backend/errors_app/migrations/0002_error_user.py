# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-07-17 14:10
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('errors_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='error',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
