# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-06-06 15:09
from __future__ import unicode_literals

from django.db import migrations

from student_app.db_script.add_upload_list import add_upload_list

class Migration(migrations.Migration):

    dependencies = [
        ('student_app', '0008_auto_20180606_1312'),
    ]

    operations = [
        migrations.RunPython(add_upload_list),
    ]
