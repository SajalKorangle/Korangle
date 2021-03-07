# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-03-07 04:46
from __future__ import unicode_literals

from django.db import migrations, models
import tc_app.models


class Migration(migrations.Migration):

    dependencies = [
        ('tc_app', '0004_auto_20210304_1945'),
    ]

    operations = [
        migrations.AddField(
            model_name='transfercertificatenew',
            name='certificateFile',
            field=models.FileField(default=None, upload_to=tc_app.models.upload_certificate_to),
            preserve_default=False,
        ),
    ]
