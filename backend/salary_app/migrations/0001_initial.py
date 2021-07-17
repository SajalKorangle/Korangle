# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-07-17 14:10
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('employee_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='EmployeePayment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.IntegerField(default=0, verbose_name='amount')),
                ('dateOfPayment', models.DateField(auto_now_add=True, verbose_name='dateOfPayment')),
                ('remark', models.TextField(null=True, verbose_name='remark')),
                ('parentEmployee', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='employee_app.Employee', verbose_name='parentEmployee')),
            ],
            options={
                'db_table': 'employee_payment',
            },
        ),
        migrations.CreateModel(
            name='Payslip',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.IntegerField(default=0, verbose_name='amount')),
                ('month', models.CharField(choices=[('APRIL', 'April'), ('MAY', 'May'), ('JUNE', 'June'), ('JULY', 'July'), ('AUGUST', 'August'), ('SEPTEMBER', 'September'), ('OCTOBER', 'October'), ('NOVEMBER', 'November'), ('DECEMBER', 'December'), ('JANUARY', 'January'), ('FEBRUARY', 'February'), ('MARCH', 'March')], default='APRIL', max_length=10, verbose_name='month')),
                ('year', models.IntegerField(default=2011, verbose_name='year')),
                ('dateOfGeneration', models.DateField(auto_now_add=True, verbose_name='dateOfGeneration')),
                ('remark', models.TextField(null=True, verbose_name='remark')),
                ('parentEmployee', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='employee_app.Employee', verbose_name='parentEmployee')),
            ],
            options={
                'db_table': 'payslip',
            },
        ),
        migrations.AlterUniqueTogether(
            name='payslip',
            unique_together=set([('parentEmployee', 'month', 'year')]),
        ),
    ]
