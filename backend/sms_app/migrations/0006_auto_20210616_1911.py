# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-06-16 13:41
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion

from sms_app.db_script.populate_sms_event_settings import populate_sms_event_settings
from sms_app.db_script.populate_sms_id import populate_sms_id
from sms_app.db_script.populate_sms_templates import populate_sms_templates


class Migration(migrations.Migration):
    dependencies = [
        ('sms_app', '0005_sms_parentmessagetype'),
    ]

    operations = [
        migrations.CreateModel(
            name='SMSEventSettings',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('SMSEventId', models.IntegerField(default=0)),
                ('customNotificationContent', models.TextField(null=True, verbose_name='customNotificationContent')),
                ('receiverType', models.CharField(
                    choices=[('All Students', 'All Students'), ('Only Absent Students', 'Only Absent Students')],
                    max_length=20, null=True, verbose_name='receiverType')),
                ('sendUpdateTypeId', models.IntegerField(default=0)),
            ],
            options={
                'db_table': 'sms_event_settings',
            },
        ),
        migrations.CreateModel(
            name='SMSId',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entityName', models.TextField(verbose_name='entityName')),
                ('entityRegistrationId', models.TextField(verbose_name='entityRegistrationId')),
                ('smsId', models.CharField(max_length=10, verbose_name='smsId')),
                ('smsIdRegistrationNumber', models.TextField(null=True, verbose_name='SMSIdRegistrationNumber')),
                ('smsIdStatus',
                 models.CharField(choices=[('ACTIVATED', 'ACTIVATED'), ('PENDING', 'PENDING')], default='PENDING',
                                  max_length=15)),
            ],
            options={
                'db_table': 'sms_id',
            },
        ),
        migrations.CreateModel(
            name='SMSIdSchool',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parentSMSId',
                 models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='sms_app.SMSId',
                                   verbose_name='parentSMSId')),
                ('parentSchool', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='school_app.School',
                                                   verbose_name='parentSchool')),
            ],
            options={
                'db_table': 'smsid_school',
            },
        ),
        migrations.CreateModel(
            name='SMSTemplate',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('createdDate', models.DateField(auto_now_add=True, verbose_name='createdDate')),
                ('templateId', models.TextField(verbose_name='templateId')),
                ('templateName', models.TextField(verbose_name='templateName')),
                ('rawContent', models.TextField(verbose_name='rawContent')),
                ('mappedContent', models.TextField(blank=True, null=True, verbose_name='mappedContent')),
                ('parentSMSId',
                 models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='sms_app.SMSId',
                                   verbose_name='parentSenderId')),
            ],
            options={
                'db_table': 'sms_template',
            },
        ),
        migrations.AddField(
            model_name='sms',
            name='SMSEventId',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='sms',
            name='mobileNumberContentJson',
            field=models.TextField(default='', verbose_name='contentMobileNumberJson'),
        ),
        migrations.AddField(
            model_name='sms',
            name='remark',
            field=models.TextField(default='SUCCESS', verbose_name='remark'),
        ),
        migrations.AddField(
            model_name='sms',
            name='sentStatus',
            field=models.BooleanField(default=True, verbose_name='sentStatus'),
        ),
        migrations.AlterField(
            model_name='sms',
            name='parentMessageType',
            field=models.ForeignKey(default=1, null=True, on_delete=django.db.models.deletion.PROTECT,
                                    to='information_app.MessageType'),
        ),
        migrations.AlterUniqueTogether(
            name='smsid',
            unique_together=set([('smsId', 'entityRegistrationId')]),
        ),
        migrations.AddField(
            model_name='smseventsettings',
            name='parentSMSTemplate',
            field=models.ForeignKey(default=0, null=True, on_delete=django.db.models.deletion.CASCADE,
                                    to='sms_app.SMSTemplate', verbose_name='parentSMSTemplate'),
        ),
        migrations.AddField(
            model_name='smseventsettings',
            name='parentSchool',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='school_app.School',
                                    verbose_name='parentSchool'),
        ),
        migrations.AddField(
            model_name='sms',
            name='parentSMSId',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.SET_DEFAULT, to='sms_app.SMSId',
                                    verbose_name='parentSMSId'),
        ),
        migrations.AddField(
            model_name='sms',
            name='scheduledDateTime',
            field=models.DateTimeField(null=True),
        ),
        migrations.RenameModel(
            old_name='MsgClubDeliveryReport',
            new_name='SMSDeliveryReport',
        ),
        migrations.AlterModelTable(
            name='smsdeliveryreport',
            table='sms_delivery_report',
        ),
        migrations.AddField(
            model_name='sms',
            name='fetchedDeliveryStatus',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='sms',
            name='smsGateWayHubVendor',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='sms',
            name='contentType',
            field=models.TextField(default='', verbose_name='contentType(DCS)'),
        ),
        migrations.AlterField(
            model_name='smsdeliveryreport',
            name='statusCode',
            field=models.TextField(null=True, verbose_name='statusCode'),
        ),
        migrations.AlterField(
            model_name='sms',
            name='parentSMSId',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.SET_DEFAULT, to='sms_app.SMSId',
                                    verbose_name='smsId'),
        ),
        migrations.AlterField(
            model_name='sms',
            name='parentSchool',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='school_app.School',
                                    verbose_name='parentSchool'),
        ),
        migrations.RunPython(populate_sms_id),
        migrations.RunPython(populate_sms_templates),
        migrations.RunPython(populate_sms_event_settings),
    ]
