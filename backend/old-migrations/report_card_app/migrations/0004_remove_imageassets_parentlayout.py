# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-06-08 13:14
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('report_card_app', '0003_auto_20210302_1400'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='imageassets',
            name='parentLayout',
        ),
    ]
