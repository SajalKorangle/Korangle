# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-11-21 10:50
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('message_app', '0005_auto_20171027_1432'),
    ]

    operations = [
        migrations.CreateModel(
            name='Paper',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('paperName', models.TextField()),
                ('showRollNumber', models.BooleanField(verbose_name=False)),
                ('showCode', models.BooleanField(verbose_name=False)),
                ('showHeading', models.BooleanField(verbose_name=True)),
                ('showQuestionHeading', models.BooleanField(verbose_name=True)),
                ('code', models.TextField()),
                ('heading', models.TextField()),
                ('time', models.TextField()),
                ('totalMarks', models.FloatField()),
                ('parentUser', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='PaperElement',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('elementContent', models.TextField()),
                ('elementNumber', models.IntegerField()),
                ('elementType', models.CharField(choices=[('qu', 'Question'), ('or', 'Or'), ('se', 'Section'), ('sq', 'SubQuestion')], default='qu', max_length=2)),
                ('elementMarks', models.FloatField()),
                ('parentPaper', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='message_app.Paper')),
            ],
        ),
    ]
