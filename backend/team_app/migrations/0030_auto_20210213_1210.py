# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-02-13 06:40
from __future__ import unicode_literals

from django.db import migrations
from team_app.db_script.add_manage_parameter_page_to_employee_module import add_manage_parameter_page_to_employee_module


class Migration(migrations.Migration):

    dependencies = [
        ('team_app', '0029_auto_20210612_1044'),
    ]

    operations = [
        migrations.RunPython(add_manage_parameter_page_to_employee_module)
    ]
