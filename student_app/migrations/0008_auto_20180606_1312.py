# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-06-06 07:42
from __future__ import unicode_literals

from django.db import migrations

from student_app.db_script.add_change_class import add_change_class

class Migration(migrations.Migration):

    dependencies = [
        ('student_app', '0007_remove_student_parentuser'),
    ]

    operations = [
        migrations.RunPython(add_change_class),
    ]
