# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-07-18 02:45
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fees_third_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='feetype',
            name='orderNumber',
            field=models.BigIntegerField(default=0, verbose_name='orderNumber'),
        ),
    ]
