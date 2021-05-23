# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-05-23 12:14
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('online_classes_app', '0003_auto_20210519_1840'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='onlineclass',
            name='endTime',
        ),
        migrations.RemoveField(
            model_name='onlineclass',
            name='startTime',
        ),
        migrations.AddField(
            model_name='onlineclass',
            name='parentAccountInfo',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='online_classes_app.AccountInfo'),
        ),
        migrations.AlterField(
            model_name='onlineclass',
            name='meetingNumber',
            field=models.BigIntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='onlineclass',
            name='password',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
    ]
