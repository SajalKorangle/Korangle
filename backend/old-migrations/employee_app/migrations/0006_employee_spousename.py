# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-12-28 14:58
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employee_app', '0005_employee_dateofleaving'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee',
            name='spouseName',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
