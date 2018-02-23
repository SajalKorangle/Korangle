# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-01-11 18:50
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import school_app.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Class',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('orderNumber', models.PositiveIntegerField(default=100)),
                ('parentUser', models.ForeignKey(default=school_app.models.get_user, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Concession',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.IntegerField()),
                ('remark', models.TextField()),
                ('generationDateTime', models.DateField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Expense',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('voucherNumber', models.IntegerField()),
                ('amount', models.IntegerField()),
                ('remark', models.TextField()),
                ('generationDateTime', models.DateField(auto_now_add=True)),
                ('parentUser', models.ForeignKey(default=school_app.models.get_user, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Fee',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('receiptNumber', models.IntegerField()),
                ('amount', models.IntegerField()),
                ('remark', models.TextField()),
                ('generationDateTime', models.DateField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('fathersName', models.CharField(max_length=100)),
                ('mobileNumber', models.IntegerField(null=True)),
                ('scholarNumber', models.IntegerField(null=True)),
                ('totalFees', models.IntegerField(null=True)),
                ('dateOfBirth', models.DateField(null=True)),
                ('remark', models.TextField(null=True)),
                ('parentClass', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.Class')),
            ],
        ),
        migrations.AddField(
            model_name='fee',
            name='parentStudent',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.Student'),
        ),
        migrations.AddField(
            model_name='concession',
            name='parentStudent',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.Student'),
        ),
    ]
