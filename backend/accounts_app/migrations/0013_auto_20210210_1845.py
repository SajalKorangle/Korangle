# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-02-10 13:15
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts_app', '0012_auto_20210210_1840'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employeeamountpermission',
            name='restrictedAmount',
            field=models.IntegerField(blank=True, default=0, null=True, verbose_name='restrictedAmount'),
        ),
    ]
