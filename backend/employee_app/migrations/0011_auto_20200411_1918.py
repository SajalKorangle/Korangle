# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2020-04-11 13:48
from __future__ import unicode_literals

from django.db import migrations
from employee_app.db_script.add_update_all_task import add_update_all_task_and_permission


class Migration(migrations.Migration):

    dependencies = [
        ('employee_app', '0010_auto_20190603_0957'),
    ]

    operations = [
        migrations.RunPython(add_update_all_task_and_permission)
    ]
