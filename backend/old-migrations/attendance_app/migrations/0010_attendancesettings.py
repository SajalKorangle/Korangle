# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-01-14 09:13
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('school_app', '0041_auto_20201202_2027'),
        ('attendance_app', '0009_auto_20200409_1653'),
    ]

    operations = [
        migrations.CreateModel(
            name='AttendanceSettings',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sentUpdateType', models.CharField(choices=[('SMS', 'SMS'), ('NOTIFICATION', 'NOTIFICATION'), ('NOTIF./SMS', 'NOTIF./SMS'), ('NULL', 'NULL')], default='NULL', max_length=20, verbose_name='sentUpdateType')),
                ('receiverType', models.CharField(choices=[('All Students', 'All Students'), ('Only Absent Students', 'Only Absent Students')], default='All Students', max_length=20, verbose_name='receiverType')),
                ('parentSchool', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.School', verbose_name='parentSchool')),
            ],
            options={
                'db_table': 'attendance_settings',
            },
        ),
    ]
