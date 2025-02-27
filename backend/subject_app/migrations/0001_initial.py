# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-08-06 18:02
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('class_app', '0001_initial'),
        ('student_app', '0001_initial'),
        ('employee_app', '0001_initial'),
        ('school_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ClassSubject',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('mainSubject', models.BooleanField(default=True, verbose_name='mainSubject')),
                ('onlyGrade', models.BooleanField(default=False, verbose_name='onlyGrade')),
                ('orderNumber', models.BigIntegerField(default=0, verbose_name='orderNumber')),
                ('parentClass', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='class_app.Class', verbose_name='parentClass')),
                ('parentDivision', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='class_app.Division', verbose_name='parentDivision')),
                ('parentEmployee', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='employee_app.Employee', verbose_name='parentEmployee')),
                ('parentSchool', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.School', verbose_name='parentSchool')),
                ('parentSession', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.Session', verbose_name='parentSession')),
            ],
            options={
                'db_table': 'class_subject',
            },
        ),
        migrations.CreateModel(
            name='ExtraField',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(default='-', verbose_name='name')),
            ],
            options={
                'db_table': 'extra_field',
            },
        ),
        migrations.CreateModel(
            name='ExtraSubField',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(default='-', verbose_name='name')),
                ('parentExtraField', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='subject_app.ExtraField', verbose_name='parentExtraField')),
            ],
            options={
                'db_table': 'extra_sub_field',
            },
        ),
        migrations.CreateModel(
            name='StudentSubject',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parentSession', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.Session', verbose_name='parentSession')),
                ('parentStudent', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='student_app.Student', verbose_name='parentStudent')),
            ],
            options={
                'db_table': 'student_subject',
            },
        ),
        migrations.CreateModel(
            name='Subject',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(default='', unique=True, verbose_name='name')),
                ('orderNumber', models.IntegerField(default=0, verbose_name='orderNumber')),
                ('governmentSubject', models.BooleanField(default=True, verbose_name='governmentSubject')),
            ],
            options={
                'db_table': 'subject',
                'ordering': ['orderNumber'],
            },
        ),
        migrations.CreateModel(
            name='SubjectSecond',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(default='-', unique=True, verbose_name='name')),
            ],
            options={
                'db_table': 'subject_second',
                'ordering': ['name'],
            },
        ),
        migrations.AddField(
            model_name='studentsubject',
            name='parentSubject',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='subject_app.SubjectSecond', verbose_name='parentSubject'),
        ),
        migrations.AddField(
            model_name='classsubject',
            name='parentSubject',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='subject_app.SubjectSecond', verbose_name='parentSubject'),
        ),
        migrations.AlterUniqueTogether(
            name='studentsubject',
            unique_together=set([('parentSubject', 'parentStudent', 'parentSession')]),
        ),
        migrations.AlterUniqueTogether(
            name='extrasubfield',
            unique_together=set([('name', 'parentExtraField')]),
        ),
        migrations.AlterUniqueTogether(
            name='classsubject',
            unique_together=set([('parentClass', 'parentDivision', 'parentSchool', 'parentSubject', 'parentSession')]),
        ),
    ]
