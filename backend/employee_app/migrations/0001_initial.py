# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-08-06 18:02
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import employee_app.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('team_app', '0001_initial'),
        ('school_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('profileImage', models.ImageField(blank=True, upload_to=employee_app.models.upload_avatar_to, verbose_name='Avatar')),
                ('name', models.CharField(max_length=100)),
                ('fatherName', models.CharField(max_length=100)),
                ('motherName', models.CharField(max_length=100, null=True)),
                ('spouseName', models.CharField(max_length=100, null=True)),
                ('dateOfBirth', models.DateField(null=True)),
                ('gender', models.TextField(null=True)),
                ('mobileNumber', models.BigIntegerField(null=True)),
                ('address', models.TextField(null=True)),
                ('aadharNumber', models.BigIntegerField(null=True)),
                ('passportNumber', models.TextField(null=True)),
                ('qualification', models.TextField(null=True)),
                ('employeeNumber', models.TextField(null=True)),
                ('currentPost', models.TextField(null=True)),
                ('dateOfJoining', models.DateField(null=True)),
                ('bankIfscCode', models.TextField(blank=True, null=True)),
                ('bankName', models.TextField(null=True)),
                ('bankAccountNumber', models.TextField(null=True)),
                ('epfAccountNumber', models.TextField(null=True)),
                ('panNumber', models.TextField(null=True)),
                ('remark', models.TextField(null=True)),
                ('monthlySalary', models.IntegerField(null=True)),
                ('pranNumber', models.TextField(null=True)),
                ('dateOfLeaving', models.DateField(null=True)),
                ('parentSchool', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.School')),
            ],
            options={
                'db_table': 'employee',
            },
        ),
        migrations.CreateModel(
            name='EmployeeParameter',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('parameterType', models.CharField(choices=[('TEXT', 'TEXT'), ('FILTER', 'FILTER'), ('DOCUMENT', 'DOCUMENT')], max_length=20)),
                ('filterValues', models.TextField(blank=True, null=True)),
                ('parentSchool', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='school_app.School', verbose_name='parentSchool')),
            ],
            options={
                'db_table': 'employee_parameter',
            },
        ),
        migrations.CreateModel(
            name='EmployeeParameterValue',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.TextField(blank=True, null=True)),
                ('document_value', models.FileField(blank=True, max_length=500, null=True, upload_to=employee_app.models.upload_document_to)),
                ('document_size', models.TextField(blank=True, null=True)),
                ('parentEmployee', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='employee_app.Employee', verbose_name='parentEmployee')),
                ('parentEmployeeParameter', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='employee_app.EmployeeParameter', verbose_name='parentEmployeeParameter')),
            ],
            options={
                'db_table': 'employee_parameter_value',
            },
        ),
        migrations.CreateModel(
            name='EmployeePermission',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('configJSON', models.TextField(default='{}')),
                ('parentEmployee', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='employee_app.Employee', verbose_name='parentEmployee')),
                ('parentTask', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='team_app.Task', verbose_name='parentTask')),
            ],
            options={
                'db_table': 'employee_permission',
            },
        ),
        migrations.CreateModel(
            name='EmployeeSessionDetail',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('paidLeaveNumber', models.IntegerField(null=True, verbose_name='paidLeaveNumber')),
                ('parentEmployee', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='employee_app.Employee', verbose_name='parentEmployee')),
                ('parentSession', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.Session', verbose_name='parentSession')),
            ],
            options={
                'db_table': 'employee_session_detail',
            },
        ),
        migrations.AlterUniqueTogether(
            name='employeesessiondetail',
            unique_together=set([('parentEmployee', 'parentSession')]),
        ),
        migrations.AlterUniqueTogether(
            name='employeepermission',
            unique_together=set([('parentTask', 'parentEmployee')]),
        ),
        migrations.AlterUniqueTogether(
            name='employeeparametervalue',
            unique_together=set([('parentEmployee', 'parentEmployeeParameter')]),
        ),
        migrations.AlterUniqueTogether(
            name='employee',
            unique_together=set([('parentSchool', 'mobileNumber')]),
        ),
    ]
