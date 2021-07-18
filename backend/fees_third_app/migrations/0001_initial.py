# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-07-18 06:24
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('school_app', '0001_initial'),
        ('accounts_app', '0001_initial'),
        ('employee_app', '0001_initial'),
        ('class_app', '0001_initial'),
        ('student_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='BusStopFilterFee',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parentBusStop', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='school_app.BusStop', verbose_name='parentBusStop')),
            ],
            options={
                'db_table': 'bus_stop_filter_fee',
            },
        ),
        migrations.CreateModel(
            name='ClassFilterFee',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parentClass', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='class_app.Class', verbose_name='parentClass')),
                ('parentDivision', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='class_app.Division', verbose_name='parentDivision')),
            ],
            options={
                'db_table': 'class_filter_fee',
            },
        ),
        migrations.CreateModel(
            name='Discount',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('discountNumber', models.IntegerField(default=0, verbose_name='discountNumber')),
                ('generationDateTime', models.DateTimeField(auto_now_add=True, verbose_name='generationDateTime')),
                ('remark', models.TextField(null=True, verbose_name='remark')),
                ('cancelled', models.BooleanField(default=False, verbose_name='cancelled')),
                ('parentEmployee', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='employee_app.Employee', verbose_name='parentEmployee')),
                ('parentSchool', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.School', verbose_name='parentSchool')),
                ('parentSession', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.Session', verbose_name='parentSession')),
                ('parentStudent', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='student_app.Student', verbose_name='parentStudent')),
            ],
            options={
                'db_table': 'discount_new',
            },
        ),
        migrations.CreateModel(
            name='FeeReceipt',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('receiptNumber', models.IntegerField(default=0, verbose_name='receiptNumber')),
                ('generationDateTime', models.DateTimeField(auto_now_add=True, verbose_name='generationDateTime')),
                ('remark', models.TextField(null=True, verbose_name='remark')),
                ('cancelled', models.BooleanField(default=False, verbose_name='cancelled')),
                ('chequeNumber', models.BigIntegerField(null=True, verbose_name='chequeNumber')),
                ('cancelledDateTime', models.DateTimeField(null=True, verbose_name='cancelledDateTime')),
                ('cancelledRemark', models.TextField(null=True, verbose_name='cancelledRemark')),
                ('modeOfPayment', models.CharField(choices=[('Cash', 'Cash'), ('Cheque', 'Cheque'), ('Online', 'Online')], max_length=20, null=True)),
                ('cancelledBy', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='cancelledBy', to='employee_app.Employee', verbose_name='cancelledBy')),
                ('parentEmployee', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='parentEmployee', to='employee_app.Employee', verbose_name='parentEmployee')),
                ('parentSchool', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.School', verbose_name='parentSchool')),
                ('parentSession', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.Session', verbose_name='parentSession')),
                ('parentStudent', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='student_app.Student', verbose_name='parentStudent')),
                ('parentTransaction', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='accounts_app.Transaction')),
            ],
            options={
                'db_table': 'fee_receipt_new',
            },
        ),
        migrations.CreateModel(
            name='FeeSettings',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sessionLocked', models.BooleanField(default=False)),
                ('accountingSettings', models.TextField(null=True)),
                ('parentSchool', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school_app.School')),
                ('parentSession', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='school_app.Session')),
            ],
        ),
        migrations.CreateModel(
            name='FeeType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(verbose_name='name')),
                ('orderNumber', models.BigIntegerField(default=0, verbose_name='orderNumber')),
                ('parentSchool', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.School', verbose_name='parentSchool')),
            ],
            options={
                'db_table': 'fee_type_new',
            },
        ),
        migrations.CreateModel(
            name='SchoolFeeRule',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(verbose_name='name')),
                ('ruleNumber', models.IntegerField(default=0, verbose_name='ruleNumber')),
                ('isClassFilter', models.BooleanField(default=False, verbose_name='isClassFilter')),
                ('isBusStopFilter', models.BooleanField(default=False, verbose_name='isBusStopFilter')),
                ('onlyNewAdmission', models.BooleanField(default=False, verbose_name='onlyNewAdmission')),
                ('includeRTE', models.BooleanField(default=True, verbose_name='includeRTE')),
                ('isAnnually', models.BooleanField(default=False, verbose_name='isAnnually')),
                ('aprilAmount', models.IntegerField(null=True, verbose_name='aprilAmount')),
                ('aprilLastDate', models.DateField(null=True, verbose_name='aprilLastDate')),
                ('aprilLateFee', models.IntegerField(null=True, verbose_name='aprilLateFee')),
                ('aprilMaximumLateFee', models.IntegerField(null=True, verbose_name='aprilMaximumLateFee')),
                ('mayAmount', models.IntegerField(null=True, verbose_name='mayAmount')),
                ('mayLastDate', models.DateField(null=True, verbose_name='mayLastDate')),
                ('mayLateFee', models.IntegerField(null=True, verbose_name='mayLateFee')),
                ('mayMaximumLateFee', models.IntegerField(null=True, verbose_name='mayMaximumLateFee')),
                ('juneAmount', models.IntegerField(null=True, verbose_name='juneAmount')),
                ('juneLastDate', models.DateField(null=True, verbose_name='juneLastDate')),
                ('juneLateFee', models.IntegerField(null=True, verbose_name='juneLateFee')),
                ('juneMaximumLateFee', models.IntegerField(null=True, verbose_name='juneMaximumLateFee')),
                ('julyAmount', models.IntegerField(null=True, verbose_name='julyAmount')),
                ('julyLastDate', models.DateField(null=True, verbose_name='julyLastDate')),
                ('julyLateFee', models.IntegerField(null=True, verbose_name='julyLateFee')),
                ('julyMaximumLateFee', models.IntegerField(null=True, verbose_name='julyMaximumLateFee')),
                ('augustAmount', models.IntegerField(null=True, verbose_name='augustAmount')),
                ('augustLastDate', models.DateField(null=True, verbose_name='augustLastDate')),
                ('augustLateFee', models.IntegerField(null=True, verbose_name='augustLateFee')),
                ('augustMaximumLateFee', models.IntegerField(null=True, verbose_name='augustMaximumLateFee')),
                ('septemberAmount', models.IntegerField(null=True, verbose_name='septemberAmount')),
                ('septemberLastDate', models.DateField(null=True, verbose_name='septemberLastDate')),
                ('septemberLateFee', models.IntegerField(null=True, verbose_name='septemberLateFee')),
                ('septemberMaximumLateFee', models.IntegerField(null=True, verbose_name='septemberMaximumLateFee')),
                ('octoberAmount', models.IntegerField(null=True, verbose_name='octoberAmount')),
                ('octoberLastDate', models.DateField(null=True, verbose_name='octoberLastDate')),
                ('octoberLateFee', models.IntegerField(null=True, verbose_name='octoberLateFee')),
                ('octoberMaximumLateFee', models.IntegerField(null=True, verbose_name='octoberMaximumLateFee')),
                ('novemberAmount', models.IntegerField(null=True, verbose_name='novemberAmount')),
                ('novemberLastDate', models.DateField(null=True, verbose_name='novemberLastDate')),
                ('novemberLateFee', models.IntegerField(null=True, verbose_name='novemberLateFee')),
                ('novemberMaximumLateFee', models.IntegerField(null=True, verbose_name='novemberMaximumLateFee')),
                ('decemberAmount', models.IntegerField(null=True, verbose_name='decemberAmount')),
                ('decemberLastDate', models.DateField(null=True, verbose_name='decemberLastDate')),
                ('decemberLateFee', models.IntegerField(null=True, verbose_name='decemberLateFee')),
                ('decemberMaximumLateFee', models.IntegerField(null=True, verbose_name='decemberMaximumLateFee')),
                ('januaryAmount', models.IntegerField(null=True, verbose_name='januaryAmount')),
                ('januaryLastDate', models.DateField(null=True, verbose_name='januaryLastDate')),
                ('januaryLateFee', models.IntegerField(null=True, verbose_name='januaryLateFee')),
                ('januaryMaximumLateFee', models.IntegerField(null=True, verbose_name='januaryMaximumLateFee')),
                ('februaryAmount', models.IntegerField(null=True, verbose_name='februaryAmount')),
                ('februaryLastDate', models.DateField(null=True, verbose_name='februaryLastDate')),
                ('februaryLateFee', models.IntegerField(null=True, verbose_name='februaryLateFee')),
                ('februaryMaximumLateFee', models.IntegerField(null=True, verbose_name='februaryMaximumLateFee')),
                ('marchAmount', models.IntegerField(null=True, verbose_name='marchAmount')),
                ('marchLastDate', models.DateField(null=True, verbose_name='marchLastDate')),
                ('marchLateFee', models.IntegerField(null=True, verbose_name='marchLateFee')),
                ('marchMaximumLateFee', models.IntegerField(null=True, verbose_name='marchMaximumLateFee')),
                ('parentFeeType', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='fees_third_app.FeeType', verbose_name='parentFeeType')),
                ('parentSession', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.Session', verbose_name='parentSession')),
            ],
            options={
                'db_table': 'school_fee_rule',
            },
        ),
        migrations.CreateModel(
            name='StudentFee',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('isAnnually', models.BooleanField(default=False, verbose_name='isAnnually')),
                ('cleared', models.BooleanField(default=False, verbose_name='cleared')),
                ('aprilAmount', models.IntegerField(null=True, verbose_name='aprilAmount')),
                ('aprilLastDate', models.DateField(null=True, verbose_name='aprilLastDate')),
                ('aprilLateFee', models.IntegerField(null=True, verbose_name='aprilLateFee')),
                ('aprilMaximumLateFee', models.IntegerField(null=True, verbose_name='aprilMaximumLateFee')),
                ('aprilClearanceDate', models.DateField(null=True, verbose_name='aprilClearanceDate')),
                ('mayAmount', models.IntegerField(null=True, verbose_name='mayAmount')),
                ('mayLastDate', models.DateField(null=True, verbose_name='mayLastDate')),
                ('mayLateFee', models.IntegerField(null=True, verbose_name='mayLateFee')),
                ('mayMaximumLateFee', models.IntegerField(null=True, verbose_name='mayMaximumLateFee')),
                ('mayClearanceDate', models.DateField(null=True, verbose_name='mayClearanceDate')),
                ('juneAmount', models.IntegerField(null=True, verbose_name='juneAmount')),
                ('juneLastDate', models.DateField(null=True, verbose_name='juneLastDate')),
                ('juneLateFee', models.IntegerField(null=True, verbose_name='juneLateFee')),
                ('juneMaximumLateFee', models.IntegerField(null=True, verbose_name='juneMaximumLateFee')),
                ('juneClearanceDate', models.DateField(null=True, verbose_name='juneClearanceDate')),
                ('julyAmount', models.IntegerField(null=True, verbose_name='julyAmount')),
                ('julyLastDate', models.DateField(null=True, verbose_name='julyLastDate')),
                ('julyLateFee', models.IntegerField(null=True, verbose_name='julyLateFee')),
                ('julyMaximumLateFee', models.IntegerField(null=True, verbose_name='julyMaximumLateFee')),
                ('julyClearanceDate', models.DateField(null=True, verbose_name='julyClearanceDate')),
                ('augustAmount', models.IntegerField(null=True, verbose_name='augustAmount')),
                ('augustLastDate', models.DateField(null=True, verbose_name='augustLastDate')),
                ('augustLateFee', models.IntegerField(null=True, verbose_name='augustLateFee')),
                ('augustMaximumLateFee', models.IntegerField(null=True, verbose_name='augustMaximumLateFee')),
                ('augustClearanceDate', models.DateField(null=True, verbose_name='augustClearanceDate')),
                ('septemberAmount', models.IntegerField(null=True, verbose_name='septemberAmount')),
                ('septemberLastDate', models.DateField(null=True, verbose_name='septemberLastDate')),
                ('septemberLateFee', models.IntegerField(null=True, verbose_name='septemberLateFee')),
                ('septemberMaximumLateFee', models.IntegerField(null=True, verbose_name='septemberMaximumLateFee')),
                ('septemberClearanceDate', models.DateField(null=True, verbose_name='septemberClearanceDate')),
                ('octoberAmount', models.IntegerField(null=True, verbose_name='octoberAmount')),
                ('octoberLastDate', models.DateField(null=True, verbose_name='octoberLastDate')),
                ('octoberLateFee', models.IntegerField(null=True, verbose_name='octoberLateFee')),
                ('octoberMaximumLateFee', models.IntegerField(null=True, verbose_name='octoberMaximumLateFee')),
                ('octoberClearanceDate', models.DateField(null=True, verbose_name='octoberClearanceDate')),
                ('novemberAmount', models.IntegerField(null=True, verbose_name='novemberAmount')),
                ('novemberLastDate', models.DateField(null=True, verbose_name='novemberLastDate')),
                ('novemberLateFee', models.IntegerField(null=True, verbose_name='novemberLateFee')),
                ('novemberMaximumLateFee', models.IntegerField(null=True, verbose_name='novemberMaximumLateFee')),
                ('novemberClearanceDate', models.DateField(null=True, verbose_name='novemberClearanceDate')),
                ('decemberAmount', models.IntegerField(null=True, verbose_name='decemberAmount')),
                ('decemberLastDate', models.DateField(null=True, verbose_name='decemberLastDate')),
                ('decemberLateFee', models.IntegerField(null=True, verbose_name='decemberLateFee')),
                ('decemberMaximumLateFee', models.IntegerField(null=True, verbose_name='decemberMaximumLateFee')),
                ('decemberClearanceDate', models.DateField(null=True, verbose_name='decemberClearanceDate')),
                ('januaryAmount', models.IntegerField(null=True, verbose_name='januaryAmount')),
                ('januaryLastDate', models.DateField(null=True, verbose_name='januaryLastDate')),
                ('januaryLateFee', models.IntegerField(null=True, verbose_name='januaryLateFee')),
                ('januaryMaximumLateFee', models.IntegerField(null=True, verbose_name='januaryMaximumLateFee')),
                ('januaryClearanceDate', models.DateField(null=True, verbose_name='januaryClearanceDate')),
                ('februaryAmount', models.IntegerField(null=True, verbose_name='februaryAmount')),
                ('februaryLastDate', models.DateField(null=True, verbose_name='februaryLastDate')),
                ('februaryLateFee', models.IntegerField(null=True, verbose_name='februaryLateFee')),
                ('februaryMaximumLateFee', models.IntegerField(null=True, verbose_name='februaryMaximumLateFee')),
                ('februaryClearanceDate', models.DateField(null=True, verbose_name='februaryClearanceDate')),
                ('marchAmount', models.IntegerField(null=True, verbose_name='marchAmount')),
                ('marchLastDate', models.DateField(null=True, verbose_name='marchLastDate')),
                ('marchLateFee', models.IntegerField(null=True, verbose_name='marchLateFee')),
                ('marchMaximumLateFee', models.IntegerField(null=True, verbose_name='marchMaximumLateFee')),
                ('marchClearanceDate', models.DateField(null=True, verbose_name='marchClearanceDate')),
                ('parentFeeType', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='fees_third_app.FeeType', verbose_name='parentFeeType')),
                ('parentSchoolFeeRule', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='fees_third_app.SchoolFeeRule', verbose_name='parentSchoolFeeRule')),
                ('parentSession', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.Session', verbose_name='parentSession')),
                ('parentStudent', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='student_app.Student', verbose_name='parentStudent')),
            ],
            options={
                'db_table': 'student_fee',
            },
        ),
        migrations.CreateModel(
            name='SubDiscount',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('isAnnually', models.BooleanField(default=False, verbose_name='isAnnually')),
                ('aprilAmount', models.IntegerField(null=True, verbose_name='aprilAmount')),
                ('aprilLateFee', models.IntegerField(null=True, verbose_name='aprilLateFee')),
                ('mayAmount', models.IntegerField(null=True, verbose_name='mayAmount')),
                ('mayLateFee', models.IntegerField(null=True, verbose_name='mayLateFee')),
                ('juneAmount', models.IntegerField(null=True, verbose_name='juneAmount')),
                ('juneLateFee', models.IntegerField(null=True, verbose_name='juneLateFee')),
                ('julyAmount', models.IntegerField(null=True, verbose_name='julyAmount')),
                ('julyLateFee', models.IntegerField(null=True, verbose_name='julyLateFee')),
                ('augustAmount', models.IntegerField(null=True, verbose_name='augustAmount')),
                ('augustLateFee', models.IntegerField(null=True, verbose_name='augustLateFee')),
                ('septemberAmount', models.IntegerField(null=True, verbose_name='septemberAmount')),
                ('septemberLateFee', models.IntegerField(null=True, verbose_name='septemberLateFee')),
                ('octoberAmount', models.IntegerField(null=True, verbose_name='octoberAmount')),
                ('octoberLateFee', models.IntegerField(null=True, verbose_name='octoberLateFee')),
                ('novemberAmount', models.IntegerField(null=True, verbose_name='novemberAmount')),
                ('novemberLateFee', models.IntegerField(null=True, verbose_name='novemberLateFee')),
                ('decemberAmount', models.IntegerField(null=True, verbose_name='decemberAmount')),
                ('decemberLateFee', models.IntegerField(null=True, verbose_name='decemberLateFee')),
                ('januaryAmount', models.IntegerField(null=True, verbose_name='januaryAmount')),
                ('januaryLateFee', models.IntegerField(null=True, verbose_name='januaryLateFee')),
                ('februaryAmount', models.IntegerField(null=True, verbose_name='februaryAmount')),
                ('februaryLateFee', models.IntegerField(null=True, verbose_name='februaryLateFee')),
                ('marchAmount', models.IntegerField(null=True, verbose_name='marchAmount')),
                ('marchLateFee', models.IntegerField(null=True, verbose_name='marchLateFee')),
                ('parentDiscount', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='fees_third_app.Discount', verbose_name='parentDiscount')),
                ('parentFeeType', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='fees_third_app.FeeType', verbose_name='parentFeeType')),
                ('parentSession', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.Session', verbose_name='parentSession')),
                ('parentStudentFee', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='fees_third_app.StudentFee', verbose_name='parentStudentFee')),
            ],
            options={
                'db_table': 'sub_discount_new',
            },
        ),
        migrations.CreateModel(
            name='SubFeeReceipt',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('isAnnually', models.BooleanField(default=False, verbose_name='isAnnually')),
                ('aprilAmount', models.IntegerField(null=True, verbose_name='aprilAmount')),
                ('aprilLateFee', models.IntegerField(null=True, verbose_name='aprilLateFee')),
                ('mayAmount', models.IntegerField(null=True, verbose_name='mayAmount')),
                ('mayLateFee', models.IntegerField(null=True, verbose_name='mayLateFee')),
                ('juneAmount', models.IntegerField(null=True, verbose_name='juneAmount')),
                ('juneLateFee', models.IntegerField(null=True, verbose_name='juneLateFee')),
                ('julyAmount', models.IntegerField(null=True, verbose_name='julyAmount')),
                ('julyLateFee', models.IntegerField(null=True, verbose_name='julyLateFee')),
                ('augustAmount', models.IntegerField(null=True, verbose_name='augustAmount')),
                ('augustLateFee', models.IntegerField(null=True, verbose_name='augustLateFee')),
                ('septemberAmount', models.IntegerField(null=True, verbose_name='septemberAmount')),
                ('septemberLateFee', models.IntegerField(null=True, verbose_name='septemberLateFee')),
                ('octoberAmount', models.IntegerField(null=True, verbose_name='octoberAmount')),
                ('octoberLateFee', models.IntegerField(null=True, verbose_name='octoberLateFee')),
                ('novemberAmount', models.IntegerField(null=True, verbose_name='novemberAmount')),
                ('novemberLateFee', models.IntegerField(null=True, verbose_name='novemberLateFee')),
                ('decemberAmount', models.IntegerField(null=True, verbose_name='decemberAmount')),
                ('decemberLateFee', models.IntegerField(null=True, verbose_name='decemberLateFee')),
                ('januaryAmount', models.IntegerField(null=True, verbose_name='januaryAmount')),
                ('januaryLateFee', models.IntegerField(null=True, verbose_name='januaryLateFee')),
                ('februaryAmount', models.IntegerField(null=True, verbose_name='februaryAmount')),
                ('februaryLateFee', models.IntegerField(null=True, verbose_name='februaryLateFee')),
                ('marchAmount', models.IntegerField(null=True, verbose_name='marchAmount')),
                ('marchLateFee', models.IntegerField(null=True, verbose_name='marchLateFee')),
                ('parentFeeReceipt', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='fees_third_app.FeeReceipt', verbose_name='parentFeeReceipt')),
                ('parentFeeType', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='fees_third_app.FeeType', verbose_name='parentFeeType')),
                ('parentSession', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.Session', verbose_name='parentSession')),
                ('parentStudentFee', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='fees_third_app.StudentFee', verbose_name='parentStudentFee')),
            ],
            options={
                'db_table': 'sub_fee_receipt__new',
            },
        ),
        migrations.AddField(
            model_name='classfilterfee',
            name='parentSchoolFeeRule',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='fees_third_app.SchoolFeeRule', verbose_name='parentSchoolFeeRule'),
        ),
        migrations.AddField(
            model_name='busstopfilterfee',
            name='parentSchoolFeeRule',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='fees_third_app.SchoolFeeRule', verbose_name='parentSchoolFeeRule'),
        ),
        migrations.AlterUniqueTogether(
            name='studentfee',
            unique_together=set([('parentSchoolFeeRule', 'parentStudent')]),
        ),
        migrations.AlterUniqueTogether(
            name='schoolfeerule',
            unique_together=set([('name', 'parentFeeType', 'parentSession'), ('ruleNumber', 'parentFeeType', 'parentSession')]),
        ),
        migrations.AlterUniqueTogether(
            name='feetype',
            unique_together=set([('name', 'parentSchool')]),
        ),
        migrations.AlterUniqueTogether(
            name='feesettings',
            unique_together=set([('parentSchool', 'parentSession')]),
        ),
        migrations.AlterUniqueTogether(
            name='feereceipt',
            unique_together=set([('receiptNumber', 'parentSchool')]),
        ),
        migrations.AlterUniqueTogether(
            name='discount',
            unique_together=set([('discountNumber', 'parentSchool')]),
        ),
    ]
