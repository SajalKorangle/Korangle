# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-03-21 16:02
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('school_app', '0042_schoolsummary'),
        ('accounts_app', '0002_auto_20210319_1611'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='accounts',
            unique_together=set([('parentSchool', 'title')]),
        ),
    ]
