# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-08-06 18:02
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('subject_app', '0001_initial'),
        ('student_app', '0001_initial'),
        ('employee_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AccountInfo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('meetingNumber', models.BigIntegerField(blank=True, null=True)),
                ('passcode', models.CharField(blank=True, max_length=10, null=True)),
                ('meetingUrl', models.CharField(blank=True, max_length=200, null=True)),
                ('parentEmployee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='employee_app.Employee', unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='OnlineClass',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('day', models.CharField(choices=[('Sunday', 'Sunday'), ('Monday', 'Monday'), ('Tuesday', 'Tuesday'), ('Wednesday', 'Wednesday'), ('Thursday', 'Thursday'), ('Friday', 'Friday'), ('Saturday', 'Saturday')], max_length=20)),
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
        migrations.CreateModel(
            name='StudentAttendance',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dateTime', models.DateTimeField(auto_now_add=True)),
                ('parentClassSubject', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='subject_app.ClassSubject')),
                ('parentStudentSection', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='student_app.StudentSection')),
            ],
        ),
    ]
