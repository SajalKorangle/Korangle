# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2020-03-22 15:23
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('examination_app', '0014_auto_20200107_0516'),
    ]

    operations = [
        migrations.AddField(
            model_name='mpboardreportcardmapping',
            name='maximumDecimalPoints',
            field=models.IntegerField(default=1, verbose_name='maximumDecimalPoint'),
        ),
        migrations.AddField(
            model_name='mpboardreportcardmapping',
            name='minimumDecimalPoints',
            field=models.IntegerField(default=0, verbose_name='minimumDecimalPoint'),
        ),
    ]
