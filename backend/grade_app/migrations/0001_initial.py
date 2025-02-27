# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-08-06 18:02
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('examination_app', '0001_initial'),
        ('student_app', '0001_initial'),
        ('school_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Grade',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(verbose_name='name')),
                ('parentSchool', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='school_app.School', verbose_name='parentSchool')),
            ],
            options={
                'db_table': 'grades',
            },
        ),
        migrations.CreateModel(
            name='StudentSubGrade',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('gradeObtained', models.TextField(blank=True, verbose_name='gradeObtained')),
                ('parentExamination', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='examination_app.Examination', verbose_name='parentExamination')),
                ('parentStudent', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='student_app.Student', verbose_name='parentStudent')),
            ],
            options={
                'db_table': 'student_sub_grade',
            },
        ),
        migrations.CreateModel(
            name='SubGrade',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(verbose_name='name')),
                ('parentGrade', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='grade_app.Grade', verbose_name='parentGrade')),
            ],
            options={
                'db_table': 'sub_grade',
            },
        ),
        migrations.AddField(
            model_name='studentsubgrade',
            name='parentSubGrade',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='grade_app.SubGrade', verbose_name='parentSubGrade'),
        ),
        migrations.AlterUniqueTogether(
            name='subgrade',
            unique_together=set([('name', 'parentGrade')]),
        ),
        migrations.AlterUniqueTogether(
            name='studentsubgrade',
            unique_together=set([('parentSubGrade', 'parentStudent', 'parentExamination')]),
        ),
        migrations.AlterUniqueTogether(
            name='grade',
            unique_together=set([('name', 'parentSchool')]),
        ),
    ]
