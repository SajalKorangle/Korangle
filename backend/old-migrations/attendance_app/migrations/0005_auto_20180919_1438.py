# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-09-19 09:08
from __future__ import unicode_literals

from django.db import migrations

from attendance_app.db_script.add_approve_leave_task import add_approve_leave_task


class Migration(migrations.Migration):

    dependencies = [
        ('class_app', '0003_marksheet'),
        ('employee_app', '0003_auto_20180918_1556'),
        ('attendance_app', '0004_attendancepermission_parentemployee'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='attendancepermission',
            unique_together=set([('parentEmployee', 'parentSection')]),
        ),
        migrations.RemoveField(
            model_name='attendancepermission',
            name='parentSchool',
        ),
        migrations.RemoveField(
            model_name='attendancepermission',
            name='parentUser',
        ),
        migrations.RunPython(add_approve_leave_task),
    ]
