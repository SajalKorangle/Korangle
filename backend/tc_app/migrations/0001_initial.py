# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-08-06 18:02
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import tc_app.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('student_app', '0001_initial'),
        ('employee_app', '0001_initial'),
        ('school_app', '0001_initial'),
        ('fees_third_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='TCImageAssets',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to=tc_app.models.upload_image_assets_to)),
            ],
        ),
        migrations.CreateModel(
            name='TCLayout',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=50, null=True)),
                ('thumbnail', models.ImageField(null=True, upload_to=tc_app.models.upload_thumbnail_to)),
                ('publiclyShared', models.BooleanField(default=False)),
                ('content', models.TextField()),
                ('parentSchool', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school_app.School')),
                ('parentStudentSection', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='student_app.Student')),
            ],
        ),
        migrations.CreateModel(
            name='TCLayoutSharing',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parentLayout', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tc_app.TCLayout')),
                ('parentSchool', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school_app.School')),
            ],
        ),
        migrations.CreateModel(
            name='TransferCertificateNew',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('certificateNumber', models.IntegerField()),
                ('certificateFile', models.FileField(upload_to=tc_app.models.upload_certificate_to)),
                ('issueDate', models.DateField(blank=True, null=True)),
                ('leavingDate', models.DateField(blank=True, null=True)),
                ('leavingReason', models.TextField(blank=True, null=True)),
                ('lastClassPassed', models.CharField(blank=True, max_length=30, null=True)),
                ('status', models.CharField(choices=[('Generated', 'Generated'), ('Issued', 'Issued'), ('Cancelled', 'Cancelled')], max_length=20)),
                ('cancelledBy', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='cancelled_tc_set', to='employee_app.Employee')),
                ('generatedBy', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='generated_tc_set', to='employee_app.Employee')),
                ('issuedBy', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='issued_tc_set', to='employee_app.Employee')),
                ('parentSession', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='school_app.Session')),
                ('parentStudent', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='student_app.Student')),
                ('parentStudentSection', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='student_app.StudentSection')),
            ],
        ),
        migrations.CreateModel(
            name='TransferCertificateSettings',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tcFee', models.IntegerField(default=0)),
                ('nextCertificateNumber', models.IntegerField(default=0)),
                ('parentFeeType', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='fees_third_app.FeeType')),
                ('parentSchool', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school_app.School', unique=True)),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='tclayoutsharing',
            unique_together=set([('parentSchool', 'parentLayout')]),
        ),
        migrations.AlterUniqueTogether(
            name='tclayout',
            unique_together=set([('parentSchool', 'name')]),
        ),
    ]
