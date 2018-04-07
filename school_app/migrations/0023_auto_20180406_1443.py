# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-04-06 09:13
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion

from school_app.db_script.backshift_bhagatsingh_session import backshift_bhagatsingh_student, populate_bhagatsingh_schoolSession

from examination_app.db_script.populate_bhagatsingh_test_structure import populate_test

from school_app.db_script.populate_bus_stop import populate_busstop


class Migration(migrations.Migration):

    dependencies = [
        ('school_app', '0022_auto_20180406_1312'),
    ]

    operations = [
        migrations.CreateModel(
            name='BusStop',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('stopName', models.TextField()),
                ('kmDistance', models.DecimalField(decimal_places=1, default=0, max_digits=7)),
                ('parentSchool', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='school_app.School', verbose_name='parentSchool')),
            ],
            options={
                'db_table': 'bus_stop',
            },
        ),
        migrations.AlterUniqueTogether(
            name='busstop',
            unique_together=set([('parentSchool', 'stopName')]),
        ),
        migrations.RunPython(backshift_bhagatsingh_student),
        migrations.RunPython(populate_bhagatsingh_schoolSession),
        migrations.RunPython(populate_test),
        migrations.RunPython(populate_busstop),
    ]
