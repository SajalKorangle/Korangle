# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-05-27 13:23
from __future__ import unicode_literals

from django.db import migrations
from team_app.db_script.upate_add_account_name import update_add_account_name


class Migration(migrations.Migration):

    dependencies = [
        ('team_app', '0026_auto_20210423_0916'),
    ]

    operations = [
        migrations.RunPython(update_add_account_name)
    ]
