# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-01-25 11:09
from __future__ import unicode_literals

from django.db import migrations
from team_app.db_script.add_online_payment_account_page import add_online_payment_account_page


class Migration(migrations.Migration):

    dependencies = [
        ('team_app', '0017_auto_20210107_1319'),
    ]

    operations = [
        migrations.RunPython(add_online_payment_account_page),
    ]
