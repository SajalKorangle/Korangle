# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2020-06-22 09:19
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('school_app', '0039_auto_20200104_2202'),
        ('student_app', '0026_auto_20200321_0304'),
    ]

    operations = [
        migrations.CreateModel(
            name='StudentParameter',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('parameterType', models.CharField(choices=[('TEXT', 'TEXT'), ('FILTER', 'FILTER')], max_length=20)),
                ('filterValues', models.TextField(blank=True, null=True)),
                ('parentSchool', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='school_app.School', verbose_name='parentSchool')),
            ],
            options={
                'db_table': 'student_parameter',
            },
        ),
        migrations.CreateModel(
            name='StudentParameterValue',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.TextField()),
                ('parentStudent', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='student_app.Student', verbose_name='parentStudent')),
                ('parentStudentParameter', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='student_app.StudentParameter', verbose_name='parentStudentParameter')),
            ],
            options={
                'db_table': 'student_parameter_value',
            },
        ),
        migrations.AlterUniqueTogether(
            name='studentparametervalue',
            unique_together=set([('parentStudent', 'parentStudentParameter')]),
        ),
    ]
