# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2020-12-15 12:24
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('homework_app', '0013_auto_20201215_1754'),
    ]

    operations = [
        migrations.AlterField(
            model_name='homeworkstatus',
            name='submissionTime',
            field=models.TimeField(null=True, verbose_name='submissionTime'),
        ),
    ]
