# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-01-15 13:03
from __future__ import unicode_literals

from django.db import migrations, models
import student_app.models


class Migration(migrations.Migration):

    dependencies = [
        ('student_app', '0029_auto_20210113_1259'),
    ]

    operations = [
        migrations.AlterField(
            model_name='studentparametervalue',
            name='document_value',
            field=models.FileField(blank=True, null=True, upload_to=student_app.models.upload_document_to),
        ),
    ]
