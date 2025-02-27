# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-08-06 18:02
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import homework_app.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('subject_app', '0001_initial'),
        ('student_app', '0001_initial'),
        ('school_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='HomeworkAnswer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('homeworkStatus', models.TextField(choices=[('GIVEN', 'GIVEN'), ('SUBMITTED', 'SUBMITTED'), ('CHECKED', 'CHECKED'), ('ASKED FOR RESUBMISSION', 'ASKED FOR RESUBMISSION')], default='GIVEN')),
                ('submissionDate', models.DateField(null=True, verbose_name='submissionDate')),
                ('submissionTime', models.TimeField(null=True, verbose_name='submissionTime')),
                ('answerText', models.TextField(blank=True, null=True)),
                ('remark', models.TextField(blank=True, null=True, verbose_name='remark')),
            ],
            options={
                'db_table': 'homework_answer',
            },
        ),
        migrations.CreateModel(
            name='HomeworkAnswerImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('answerImage', models.ImageField(blank=True, null=True, upload_to=homework_app.models.upload_answer_to, verbose_name='answer_image')),
                ('orderNumber', models.IntegerField(default=0, verbose_name='orderNumber')),
                ('parentHomeworkAnswer', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='homework_app.HomeworkAnswer', verbose_name='parentHomeworkAnswer')),
            ],
            options={
                'db_table': 'homework_answer_image',
            },
        ),
        migrations.CreateModel(
            name='HomeworkQuestion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('homeworkName', models.TextField(default='')),
                ('startDate', models.DateField(verbose_name='startDate')),
                ('endDate', models.DateField(null=True, verbose_name='endDate')),
                ('startTime', models.TimeField(verbose_name='startTime')),
                ('endTime', models.TimeField(blank=True, default='23:59:59', null=True, verbose_name='endTime')),
                ('homeworkText', models.TextField(blank=True, null=True)),
                ('parentClassSubject', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='subject_app.ClassSubject', verbose_name='parentClassSubject')),
            ],
            options={
                'db_table': 'homework_question',
            },
        ),
        migrations.CreateModel(
            name='HomeworkQuestionImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('questionImage', models.ImageField(blank=True, null=True, upload_to=homework_app.models.upload_question_to, verbose_name='question_image')),
                ('orderNumber', models.IntegerField(default=0, verbose_name='orderNumber')),
                ('parentHomeworkQuestion', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='homework_app.HomeworkQuestion', verbose_name='parentHomeworkQuestion')),
            ],
            options={
                'db_table': 'homework_question_image',
            },
        ),
        migrations.CreateModel(
            name='HomeworkSettings',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sentUpdateType', models.CharField(choices=[('SMS', 'SMS'), ('NOTIFICATION', 'NOTIFICATION'), ('NOTIF./SMS', 'NOTIF./SMS'), ('NULL', 'NULL')], default='NULL', max_length=20, verbose_name='sentUpdateType')),
                ('sendCreateUpdate', models.BooleanField(default=False, verbose_name='sendCreateUpdate')),
                ('sendEditUpdate', models.BooleanField(default=False, verbose_name='sendEditUpdate')),
                ('sendDeleteUpdate', models.BooleanField(default=False, verbose_name='sendDeleteUpdate')),
                ('sendCheckUpdate', models.BooleanField(default=False, verbose_name='sendCheckUpdate')),
                ('sendResubmissionUpdate', models.BooleanField(default=False, verbose_name='sendResubmissionUpdate')),
                ('parentSchool', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.School', verbose_name='parentSchool')),
            ],
            options={
                'db_table': 'homework_settings',
            },
        ),
        migrations.AddField(
            model_name='homeworkanswer',
            name='parentHomeworkQuestion',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='homework_app.HomeworkQuestion', verbose_name='parentHomeworkQuestion'),
        ),
        migrations.AddField(
            model_name='homeworkanswer',
            name='parentStudent',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='student_app.Student', verbose_name='parentStudent'),
        ),
        migrations.AlterUniqueTogether(
            name='homeworkanswer',
            unique_together=set([('parentStudent', 'parentHomeworkQuestion')]),
        ),
    ]
