# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-04-19 12:05
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tutorial_app', '0002_tutorialsettings'),
        ('sms_app', '0006_auto_20210421_1313'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tutorialsettings',
            name='parentSchool',
        ),
        migrations.RemoveField(
            model_name='tutorialsettings',
            name='sentUpdateType',
        ),
        migrations.DeleteModel(
            name='TutorialSettings',
        ),
    ]
