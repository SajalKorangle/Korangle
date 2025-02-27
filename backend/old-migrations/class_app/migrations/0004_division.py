# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-11-11 09:23
from __future__ import unicode_literals

from django.db import migrations, models

from class_app.db_script.populateDivision import populateDivision

class Migration(migrations.Migration):

    dependencies = [
        ('class_app', '0003_marksheet'),
    ]

    operations = [
        migrations.CreateModel(
            name='Division',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
                ('orderNumber', models.IntegerField(default=0)),
            ],
            options={
                'db_table': 'division',
            },
        ),
        migrations.RunPython(populateDivision),
    ]
