# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-01-11 19:05
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('school_app', '0003_student_scholarnumber'),
    ]

    operations = [
        migrations.AlterField(
            model_name='student',
            name='scholarNumber',
            field=models.TextField(null=True),
        ),
    ]
