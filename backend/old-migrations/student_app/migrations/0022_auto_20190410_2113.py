# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2019-04-10 15:43
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('student_app', '0021_auto_20190329_1242'),
    ]

    operations = [
        migrations.AlterField(
            model_name='student',
            name='parentTransferCertificate',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='student_app.TransferCertificate', verbose_name='parentTransferCertificate'),
        ),
    ]
