# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-05-12 09:50
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion

from student_app.db_script.populate_school_in_student import populate_school_in_student


class Migration(migrations.Migration):

    dependencies = [
        ('school_app', '0025_auto_20180429_1533'),
        ('student_app', '0005_student_admissionsession'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='parentSchool',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.School'),
        ),
        migrations.RunPython(populate_school_in_student),
    ]
