# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-01-19 07:54
from __future__ import unicode_literals

from django.db import migrations
from information_app.db_script.populate_homework_tutorial_type import populate_homework_tutorial_type


class Migration(migrations.Migration):

    dependencies = [
        ('information_app', '0002_sentupdatetype'),
    ]

    operations = [
        migrations.RunPython(populate_homework_tutorial_type),
    ]
