# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-05-24 14:59
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('student_app', '0032_student_parentadmissionclass'),
        ('employee_app', '0013_employeepermission_configjson'),
        ('subject_app', '0006_auto_20190901_1142'),
    ]

    operations = [
        migrations.CreateModel(
            name='AccountInfo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=150)),
                ('password', models.CharField(max_length=150)),
                ('parentEmployee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='employee_app.Employee', unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='OnlineClass',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('day', models.CharField(choices=[('Sunday', 'Sunday'), ('Monday', 'Monday'), ('Tuesday', 'Tuesday'), ('Wednesday', 'Wednesday'), ('Thursday', 'Thursday'), ('Friday', 'Friday'), ('Saturday', 'Saturday')], max_length=20)),
                ('meetingNumber', models.BigIntegerField(blank=True, null=True)),
                ('password', models.CharField(blank=True, max_length=10, null=True)),
                ('startTimeJSON', models.CharField(max_length=100)),
                ('endTimeJSON', models.CharField(max_length=100)),
                ('parentClassSubject', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='subject_app.ClassSubject')),
            ],
        ),
        migrations.CreateModel(
            name='RestrictedStudent',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parentStudent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='student_app.Student', unique=True)),
            ],
        ),
    ]
