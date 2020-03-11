# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2020-03-11 15:41
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('school_app', '0039_auto_20200104_2202'),
        ('student_app', '0024_auto_20190901_1142'),
        ('custom_reportcard', '0004_auto_20200311_1504'),
    ]

    operations = [
        migrations.CreateModel(
            name='StudentRemarks',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('remark', models.TextField(verbose_name='remarks')),
                ('parentSession', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='school_app.Session', verbose_name='parentSession')),
                ('parentStudent', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='student_app.Student', verbose_name='parentStudent')),
            ],
            options={
                'db_table': 'student_remarks',
            },
        ),
        migrations.AlterUniqueTogether(
            name='studentremarks',
            unique_together=set([('parentStudent', 'parentSession')]),
        ),
    ]
