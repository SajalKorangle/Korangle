# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-04-21 20:11
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('errors_app', '0003_auto_20210316_1301'),
    ]

    operations = [
        migrations.AddField(
            model_name='error',
            name='frontendUrl',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='error',
            name='postDataBody',
            field=models.TextField(blank=True, null=True),
        ),
    ]
