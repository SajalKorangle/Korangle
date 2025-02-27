# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2019-09-01 06:12
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fee_second_app', '0007_auto_20190422_1740'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='busstopbasedfilter',
            name='parentBusStop',
        ),
        migrations.RemoveField(
            model_name='busstopbasedfilter',
            name='parentSchoolFeeComponent',
        ),
        migrations.RemoveField(
            model_name='classbasedfilter',
            name='parentClass',
        ),
        migrations.RemoveField(
            model_name='classbasedfilter',
            name='parentSchoolFeeComponent',
        ),
        migrations.RemoveField(
            model_name='concessionsecond',
            name='parentEmployee',
        ),
        migrations.RemoveField(
            model_name='concessionsecond',
            name='parentStudent',
        ),
        migrations.AlterUniqueTogether(
            name='feedefinition',
            unique_together=set([]),
        ),
        migrations.RemoveField(
            model_name='feedefinition',
            name='parentFeeType',
        ),
        migrations.RemoveField(
            model_name='feedefinition',
            name='parentSchool',
        ),
        migrations.RemoveField(
            model_name='feedefinition',
            name='parentSession',
        ),
        migrations.RemoveField(
            model_name='feereceiptold',
            name='parentEmployee',
        ),
        migrations.RemoveField(
            model_name='feereceiptold',
            name='parentStudent',
        ),
        migrations.AlterUniqueTogether(
            name='schoolfeecomponent',
            unique_together=set([]),
        ),
        migrations.RemoveField(
            model_name='schoolfeecomponent',
            name='parentFeeDefinition',
        ),
        migrations.RemoveField(
            model_name='schoolmonthlyfeecomponent',
            name='parentMonth',
        ),
        migrations.RemoveField(
            model_name='schoolmonthlyfeecomponent',
            name='parentSchoolFeeComponent',
        ),
        migrations.AlterUniqueTogether(
            name='studentfeecomponent',
            unique_together=set([]),
        ),
        migrations.RemoveField(
            model_name='studentfeecomponent',
            name='parentFeeDefinition',
        ),
        migrations.RemoveField(
            model_name='studentfeecomponent',
            name='parentStudent',
        ),
        migrations.RemoveField(
            model_name='studentfeedues',
            name='parentStudent',
        ),
        migrations.AlterUniqueTogether(
            name='studentmonthlyfeecomponent',
            unique_together=set([]),
        ),
        migrations.RemoveField(
            model_name='studentmonthlyfeecomponent',
            name='parentMonth',
        ),
        migrations.RemoveField(
            model_name='studentmonthlyfeecomponent',
            name='parentStudentFeeComponent',
        ),
        migrations.RemoveField(
            model_name='subconcession',
            name='parentConcessionSecond',
        ),
        migrations.RemoveField(
            model_name='subconcession',
            name='parentStudentFeeComponent',
        ),
        migrations.RemoveField(
            model_name='subconcessionmonthly',
            name='parentMonth',
        ),
        migrations.RemoveField(
            model_name='subconcessionmonthly',
            name='parentSubConcession',
        ),
        migrations.RemoveField(
            model_name='subfeereceipt',
            name='parentFeeReceipt',
        ),
        migrations.RemoveField(
            model_name='subfeereceipt',
            name='parentStudentFeeComponent',
        ),
        migrations.RemoveField(
            model_name='subfeereceiptmonthly',
            name='parentMonth',
        ),
        migrations.RemoveField(
            model_name='subfeereceiptmonthly',
            name='parentSubFeeReceipt',
        ),
        migrations.DeleteModel(
            name='BusStopBasedFilter',
        ),
        migrations.DeleteModel(
            name='ClassBasedFilter',
        ),
        migrations.DeleteModel(
            name='ConcessionSecond',
        ),
        migrations.DeleteModel(
            name='FeeDefinition',
        ),
        migrations.DeleteModel(
            name='FeeReceiptOld',
        ),
        migrations.DeleteModel(
            name='FeeType',
        ),
        migrations.DeleteModel(
            name='Month',
        ),
        migrations.DeleteModel(
            name='SchoolFeeComponent',
        ),
        migrations.DeleteModel(
            name='SchoolMonthlyFeeComponent',
        ),
        migrations.DeleteModel(
            name='StudentFeeComponent',
        ),
        migrations.DeleteModel(
            name='StudentFeeDues',
        ),
        migrations.DeleteModel(
            name='StudentMonthlyFeeComponent',
        ),
        migrations.DeleteModel(
            name='SubConcession',
        ),
        migrations.DeleteModel(
            name='SubConcessionMonthly',
        ),
        migrations.DeleteModel(
            name='SubFeeReceipt',
        ),
        migrations.DeleteModel(
            name='SubFeeReceiptMonthly',
        ),
    ]
