# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-03-09 09:30
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts_app', '0004_auto_20210309_1421'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='accountsession',
            name='title',
        ),
    ]
