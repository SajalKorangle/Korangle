# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-07-27 10:39
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('student_app', '0009_auto_20180606_2039'),
    ]

    operations = [
        migrations.CreateModel(
            name='TransferCertificate',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('certificateNumber', models.IntegerField()),
                ('issueDate', models.DateField()),
                ('admissionDate', models.DateField()),
                ('leavingDate', models.DateField()),
                ('leavingReason', models.TextField()),
                ('admissionClass', models.TextField()),
                ('lastClassPassed', models.TextField()),
                ('leavingMidSession', models.BooleanField(default=False)),
                ('lastClassAttended', models.TextField(null=True)),
                ('lastClassAttendance', models.IntegerField(null=True)),
                ('attendanceOutOf', models.IntegerField(null=True)),
            ],
            options={
                'db_table': 'student_transfer_certificate',
            },
        ),
        migrations.AddField(
            model_name='student',
            name='parentTransferCertificate',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='student_app.TransferCertificate', verbose_name='parentTransferCertificate'),
        ),
    ]
