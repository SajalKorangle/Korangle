# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-03-11 12:27
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tc_app', '0002_transfercertificatenew_parentsession'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transfercertificatenew',
            name='parentSession',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='school_app.Session'),
        ),
    ]
