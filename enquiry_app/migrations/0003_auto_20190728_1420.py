# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2019-07-28 08:50
from __future__ import unicode_literals

from django.db import migrations

from enquiry_app.db_script.access_enquiry_app2 import access_enquiry_app

class Migration(migrations.Migration):

    dependencies = [
        ('enquiry_app', '0002_auto_20180526_1812'),
    ]

    operations = [
        migrations.RunPython(access_enquiry_app),
    ]
