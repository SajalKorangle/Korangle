# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-02-10 13:08
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts_app', '0008_auto_20210210_1833'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='ApprovalRequests',
            new_name='Approval',
        ),
        migrations.RenameField(
            model_name='approvalrequestaccountdetails',
            old_name='account',
            new_name='parentAccount',
        ),
        migrations.RenameField(
            model_name='transactionaccountdetails',
            old_name='account',
            new_name='parentAccount',
        ),
        migrations.AlterModelTable(
            name='approval',
            table='approval',
        ),
    ]
