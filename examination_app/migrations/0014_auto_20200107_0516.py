# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2020-01-06 23:46
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('examination_app', '0013_auto_20200107_0513'),
    ]

    operations = [
        migrations.AlterField(
            model_name='examination',
            name='status',
            field=models.CharField(choices=[('Created', 'Created'), ('Declared', 'Declared')], default='Created', max_length=20, verbose_name='examinationStatus'),
        ),
    ]
