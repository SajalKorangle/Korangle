# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-07-18 06:06
from __future__ import unicode_literals

from django.db import migrations
from attendance_app.db_script.fix_crroupt_attendance import delete_crroupt_attendance_app


class Migration(migrations.Migration):

    dependencies = [
        ('attendance_app', '0010_attendancesettings'),
    ]

    operations = [
        migrations.RunPython(delete_crroupt_attendance_app)
    ]
