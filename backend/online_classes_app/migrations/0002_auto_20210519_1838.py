# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-05-19 13:08
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('school_app', '0043_auto_20210414_1604'),
        ('student_app', '0032_student_parentadmissionclass'),
        ('online_classes_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='RestrictedStuden',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parentStudent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='student_app.Student', unique=True)),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='accountinfo',
            unique_together=set([('parentSchool', 'username')]),
        ),
        migrations.AlterModelTable(
            name='accountinfo',
            table='AccountInfo',
        ),
    ]
