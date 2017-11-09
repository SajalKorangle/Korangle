# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-10-27 14:32
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('message_app', '0004_auto_20171025_0917'),
    ]

    operations = [
        migrations.CreateModel(
            name='SubQuestion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
            ],
        ),
        migrations.RenameField(
            model_name='chapter',
            old_name='parentSubjectId',
            new_name='parentSubject',
        ),
        migrations.RenameField(
            model_name='question',
            old_name='question',
            new_name='content',
        ),
        migrations.RenameField(
            model_name='question',
            old_name='parentChapterId',
            new_name='parentChapter',
        ),
        migrations.RenameField(
            model_name='subject',
            old_name='parentClassId',
            new_name='parentClass',
        ),
        migrations.AddField(
            model_name='subquestion',
            name='parentQuestion',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='message_app.Question'),
        ),
    ]
