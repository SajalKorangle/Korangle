# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2020-03-03 14:33
from __future__ import unicode_literals

from django.db import migrations
from team_app.db_script.add_create_grade_task import add_create_grade_task_and_permission
from team_app.db_script.add_grade_student_task import add_grade_student_and_permission
from team_app.db_script.add_view_grade_and_permission import add_view_grade_and_permission

class Migration(migrations.Migration):

    dependencies = [
        ('team_app', '0007_auto_20200303_1633'),
    ]

    operations = [
        migrations.RunPython(add_create_grade_task_and_permission),
        migrations.RunPython(add_grade_student_and_permission),
        migrations.RunPython(add_view_grade_and_permission)
        
    ]
