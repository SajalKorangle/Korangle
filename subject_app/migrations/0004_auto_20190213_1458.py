# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2019-02-13 09:28
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion

from subject_app.db_script.populate_extra_field import populate_extra_field


class Migration(migrations.Migration):

    dependencies = [
        ('subject_app', '0003_auto_20181221_2208'),
    ]

    operations = [
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
        migrations.AlterUniqueTogether(
            name='extrasubfield',
            unique_together=set([('name', 'parentExtraField')]),
        ),
        migrations.RunPython(populate_extra_field),
    ]
