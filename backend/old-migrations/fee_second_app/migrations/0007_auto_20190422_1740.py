# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2019-04-22 12:10
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fee_second_app', '0006_auto_20180919_1504'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='FeeReceipt',
            new_name='FeeReceiptOld',
        ),
    ]
