# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2020-10-18 22:09
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('team_app', '0012_auto_20200822_1633'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='videoUrl',
            field=models.TextField(null=True, verbose_name='videoUrl'),
        ),
    ]
