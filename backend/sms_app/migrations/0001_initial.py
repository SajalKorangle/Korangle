# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-07-17 14:10
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('school_app', '0001_initial'),
        ('information_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='MsgClubDeliveryReport',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('requestId', models.TextField(verbose_name='requestId')),
                ('mobileNumber', models.IntegerField(verbose_name='mobileNumber')),
                ('status', models.TextField(verbose_name='status')),
                ('statusCode', models.TextField(verbose_name='statusCode')),
                ('deliveredDateTime', models.DateTimeField(null=True, verbose_name='deliveredDateTime')),
                ('senderId', models.CharField(default='KORNGL', max_length=10, verbose_name='senderId')),
            ],
            options={
                'db_table': 'msg_club_delivery_report',
            },
        ),
        migrations.CreateModel(
            name='SMS',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('contentType', models.TextField(default='', verbose_name='contentType')),
                ('content', models.TextField(default='', verbose_name='content')),
                ('sentDateTime', models.DateTimeField(auto_now_add=True, verbose_name='sentDateTime')),
                ('count', models.IntegerField(default=0, verbose_name='count')),
                ('notificationCount', models.IntegerField(default=0, verbose_name='notificationCount')),
                ('mobileNumberList', models.TextField(blank=True, default='', verbose_name='mobileNumberList')),
                ('notificationMobileNumberList', models.TextField(blank=True, default='', verbose_name='notificationMobileNumberList')),
                ('requestId', models.TextField(null=True, verbose_name='requestId')),
                ('parentMessageType', models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, to='information_app.MessageType')),
                ('parentSchool', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.School', verbose_name='parentSchool')),
            ],
            options={
                'db_table': 'sms',
            },
        ),
        migrations.CreateModel(
            name='SMSPurchase',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('numberOfSMS', models.IntegerField(default=0, verbose_name='numberOfSMS')),
                ('price', models.IntegerField(default=0, verbose_name='price')),
                ('purchaseDateTime', models.DateTimeField(auto_now_add=True, verbose_name='purchaseDateTime')),
                ('parentSchool', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.School', verbose_name='parentSchool')),
            ],
            options={
                'db_table': 'sms_purchase',
            },
        ),
        migrations.AlterUniqueTogether(
            name='msgclubdeliveryreport',
            unique_together=set([('requestId', 'mobileNumber')]),
        ),
    ]
