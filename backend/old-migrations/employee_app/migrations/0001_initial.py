# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-05-24 20:42
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('school_app', '0026_remove_school_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('fatherName', models.CharField(max_length=100)),
                ('motherName', models.CharField(max_length=100, null=True)),
                ('dateOfBirth', models.DateField(null=True)),
                ('gender', models.TextField(null=True)),
                ('mobileNumber', models.IntegerField(null=True)),
                ('address', models.TextField(null=True)),
                ('aadharNumber', models.IntegerField(null=True)),
                ('passportNumber', models.TextField(null=True)),
                ('qualification', models.TextField(null=True)),
                ('employeeNumber', models.TextField(null=True)),
                ('currentPost', models.TextField(null=True)),
                ('dateOfJoining', models.DateField(null=True)),
                ('bankName', models.TextField(null=True)),
                ('bankAccountNumber', models.TextField(null=True)),
                ('epfAccountNumber', models.TextField(null=True)),
                ('panNumber', models.TextField(null=True)),
                ('remark', models.TextField(null=True)),
                ('parentSchool', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.School')),
            ],
            options={
                'db_table': 'employee',
            },
        ),
    ]
