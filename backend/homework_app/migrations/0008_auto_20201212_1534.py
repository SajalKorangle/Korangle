# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2020-12-12 10:04
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('homework_app', '0007_auto_20201212_1532'),
    ]

    operations = [
        migrations.AlterField(
            model_name='homework',
            name='endTime',
            field=models.TimeField(default='23:59:59', verbose_name='endTime'),
        ),
        migrations.AlterField(
            model_name='homework',
            name='startTime',
            field=models.TimeField(default='15:34:39', verbose_name='startTime'),
        ),
        migrations.AlterField(
            model_name='homeworkstatus',
            name='submissionTime',
            field=models.TimeField(default='15:34:39', null=True),
        ),
    ]
