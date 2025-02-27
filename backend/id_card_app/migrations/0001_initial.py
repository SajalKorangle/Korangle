# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-08-06 18:02
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import id_card_app.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('school_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='IdCardLayout',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=50, null=True)),
                ('content', models.TextField()),
                ('background', models.ImageField(blank=True, null=True, upload_to=id_card_app.models.upload_id_card_to, verbose_name='id_card_background')),
                ('parentSchool', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school_app.School')),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='idcardlayout',
            unique_together=set([('parentSchool', 'name')]),
        ),
    ]
