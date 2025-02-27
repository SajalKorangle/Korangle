# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2020-04-09 11:23
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('salary_app', '0003_auto_20190115_2313'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employeepayment',
            name='parentEmployee',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='employee_app.Employee', verbose_name='parentEmployee'),
        ),
        migrations.AlterField(
            model_name='payslip',
            name='parentEmployee',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='employee_app.Employee', verbose_name='parentEmployee'),
        ),
    ]
