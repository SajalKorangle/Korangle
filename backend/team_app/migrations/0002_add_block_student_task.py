# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-07-13 11:15
from __future__ import unicode_literals

from django.db import migrations

from team_app.db_script.block_student import student_add_task


class Migration(migrations.Migration):

    dependencies = [
        ('team_app', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(student_add_task),
    ]
