# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2019-06-05 07:40
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fees_third_app', '0003_auto_20190604_1931'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='feefeature',
            name='parentUser',
        ),
        migrations.DeleteModel(
            name='FeeFeature',
        ),
    ]
