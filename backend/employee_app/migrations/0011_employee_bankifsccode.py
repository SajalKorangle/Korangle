# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2020-03-31 14:10
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employee_app', '0010_auto_20190603_0957'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee',
            name='bankIfscCode',
            field=models.TextField(blank=True, null=True),
        ),
    ]
