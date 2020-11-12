# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2020-11-10 17:11
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('student_app', '0027_auto_20200816_1155'),
        ('examination_app', '0015_auto_20200322_2053'),
    ]

    operations = [
        migrations.CreateModel(
            name='Remarks',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('remark', models.TextField(blank=True, default='-', verbose_name='remark')),
                ('parentExamination', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='examination_app.Examination', verbose_name='parentExamination')),
                ('parentStudent', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='student_app.Student', verbose_name='parentStudent')),
            ],
            options={
                'db_table': 'remarks',
            },
        ),
        migrations.AlterUniqueTogether(
            name='remarks',
            unique_together=set([('parentStudent', 'parentExamination')]),
        ),
    ]
