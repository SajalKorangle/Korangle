# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2020-03-03 11:03
from __future__ import unicode_literals

from django.db import migrations
from team_app.db_script.adding_grade_module import add_grade_module

class Migration(migrations.Migration):

    dependencies = [
        ('team_app', '0006_auto_20200205_1624'),
    ]

    operations = [
        migrations.RunPython(add_grade_module),
    ]
