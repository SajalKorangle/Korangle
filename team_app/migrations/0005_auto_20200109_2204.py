# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2020-01-09 16:34
from __future__ import unicode_literals

from django.db import migrations
from team_app.db_script.rename_view_defaulters import rename_view_defaulters


class Migration(migrations.Migration):

    dependencies = [
        ('team_app', '0004_auto_20191130_2039'),
    ]

    operations = [
        migrations.RunPython(rename_view_defaulters),
    ]
