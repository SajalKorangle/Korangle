# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-04-23 03:46
from __future__ import unicode_literals

from django.db import migrations
from team_app.db_script.online_classes_module import add_online_classes_module_and_tasks


class Migration(migrations.Migration):

    dependencies = [
        ('team_app', '0025_auto_20210420_1018'),
    ]

    operations = [
        migrations.RunPython(add_online_classes_module_and_tasks)
    ]
