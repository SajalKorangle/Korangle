# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-08-06 18:02
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('school_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Module',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('path', models.TextField(default='', unique=True, verbose_name='path')),
                ('title', models.TextField(default='', verbose_name='title')),
                ('icon', models.TextField(default='', verbose_name='icon')),
                ('orderNumber', models.IntegerField(default=1)),
                ('parentBoard', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='school_app.Board', verbose_name='parentBoard')),
            ],
            options={
                'db_table': 'module',
            },
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('path', models.TextField(default='', verbose_name='path')),
                ('title', models.TextField(default='', verbose_name='title')),
                ('orderNumber', models.IntegerField(default=1)),
                ('videoUrl', models.TextField(null=True, verbose_name='videoUrl')),
                ('parentBoard', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='school_app.Board', verbose_name='parentBoard')),
                ('parentModule', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='team_app.Module', verbose_name='parentModule')),
            ],
            options={
                'db_table': 'task',
            },
        ),
        migrations.AlterUniqueTogether(
            name='task',
            unique_together=set([('parentModule', 'path')]),
        ),
    ]
