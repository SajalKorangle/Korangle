# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2019-02-03 18:09
from __future__ import unicode_literals

from django.db import migrations

from student_app.db_script.move_mobile_number import move_mobile_number


class Migration(migrations.Migration):

    dependencies = [
        ('student_app', '0019_student_secondmobilenumber'),
    ]

    operations = [
        migrations.RunPython(move_mobile_number),
    ]
