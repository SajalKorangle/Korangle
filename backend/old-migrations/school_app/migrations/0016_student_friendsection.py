# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-03-01 18:55
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('class_app', '0001_initial'),
        ('school_app', '0015_session_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='friendSection',
            field=models.ManyToManyField(to='class_app.Section'),
        ),
    ]
