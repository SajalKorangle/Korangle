# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-01-11 18:52
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('school_app', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='student',
            name='scholarNumber',
        ),
    ]
