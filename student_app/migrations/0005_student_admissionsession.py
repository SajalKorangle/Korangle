# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-05-07 15:25
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('school_app', '0025_auto_20180429_1533'),
        ('student_app', '0004_student_rte'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='admissionSession',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='school_app.Session', verbose_name='admissionSession'),
        ),
    ]
