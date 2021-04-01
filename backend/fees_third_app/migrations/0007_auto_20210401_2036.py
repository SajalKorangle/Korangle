# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-04-01 15:06
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('fees_third_app', '0006_auto_20210401_1739'),
    ]

    operations = [
        migrations.AlterField(
            model_name='feesettings',
            name='parentSchool',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school_app.School', unique=True),
        ),
    ]
