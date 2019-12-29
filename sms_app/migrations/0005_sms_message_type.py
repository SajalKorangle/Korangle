# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2019-12-24 16:09
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sms_app', '0004_auto_20190827_1351'),
    ]

    operations = [
        migrations.AddField(
            model_name='sms',
            name='message_type',
            field=models.CharField(choices=[('CST', 'Custom'), ('DEF', 'Defaulter'), ('ATN', 'Attendance'), ('FEE', 'Fees'), ('EXM', 'Examination')], default='CST', max_length=3),
        ),
    ]
