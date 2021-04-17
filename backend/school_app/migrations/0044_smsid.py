# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-04-17 09:13
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion

from school_app.db_script.populate_smsId import populate_sms_id


class Migration(migrations.Migration):

    dependencies = [
        ('school_app', '0043_auto_20210414_1604'),
    ]

    operations = [
        migrations.CreateModel(
            name='SMSId',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('smsId', models.CharField(default='KORNGL', max_length=10, verbose_name='smsId')),
                ('registrationNumber', models.TextField(null=True, verbose_name='registrationNumber')),
                ('smsIdStatus', models.CharField(choices=[('ACTIVATED', 'ACTIVATED'), ('PENDING', 'PENDING'), ('NOT REGISTERED', 'NOT REGISTERED')], default='NOT REGISTERED', max_length=15)),
                ('parentSchool', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='school_app.School', verbose_name='parentSchool')),
            ],
            options={
                'db_table': 'sms_id',
            },
        ),
        migrations.RunPython(populate_sms_id),
        migrations.RemoveField(
            model_name='school',
            name='smsId',
        ),
    ]
