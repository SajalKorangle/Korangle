# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2020-01-25 13:37
from __future__ import unicode_literals

from django.db import migrations, models

from examination_app.db_script.scale_marks_from_10_to_2 import scale_marks_from_10_to_2


class Migration(migrations.Migration):

    dependencies = [
        ('examination_app', '0012_auto_20190901_1142'),
    ]

    operations = [
        migrations.AlterField(
            model_name='studentextrasubfield',
            name='marksObtained',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=6, verbose_name='marksObtained'),
        ),
        migrations.RunPython(scale_marks_from_10_to_2),
    ]
