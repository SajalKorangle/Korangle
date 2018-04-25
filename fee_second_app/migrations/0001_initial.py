# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-04-22 09:45
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion

from fee_second_app.db_script.initialize_fee_database import initialize_fee_database
from student_app.db_script.delete_aatifkhan_profile import delete_aatifkhan_profile

class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('student_app', '0003_student_currentbusstop'),
        ('school_app', '0025_auto_20180410_1410'),
        ('class_app', '0003_marksheet'),
    ]

    operations = [
        migrations.CreateModel(
            name='BusStopBasedFilter',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parentBusStop', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.BusStop')),
            ],
            options={
                'db_table': 'bus_stop_based_filter',
            },
        ),
        migrations.CreateModel(
            name='ClassBasedFilter',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parentClass', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='class_app.Class')),
            ],
            options={
                'db_table': 'class_based_filter',
            },
        ),
        migrations.CreateModel(
            name='Concession',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('remark', models.TextField(verbose_name='remark')),
                ('generationDateTime', models.DateTimeField(auto_now_add=True, verbose_name='generationDateTime')),
            ],
            options={
                'db_table': 'concession_second',
            },
        ),
        migrations.CreateModel(
            name='FeeDefinition',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('orderNumber', models.IntegerField()),
                ('rteAllowed', models.BooleanField(default=False)),
                ('filterType', models.CharField(choices=[('CLASS', 'Class'), ('BUS STOP', 'Bus Stop'), ('BOTH', 'Both'), ('NONE', 'None')], default='NONE', max_length=9)),
                ('frequency', models.CharField(choices=[('MONTHLY', 'Monthly'), ('QUATERLY', 'Quaterly'), ('ANNUALLY', 'Annually')], default='ANNUALLY', max_length=10)),
            ],
            options={
                'db_table': 'fee_definition',
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
                ('parentStudent', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='student_app.Student', verbose_name='parentStudent')),
            ],
            options={
                'db_table': 'fee_receipt',
            },
        ),
        migrations.CreateModel(
            name='FeeType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(unique=True, verbose_name='name')),
            ],
            options={
                'db_table': 'fee_type',
            },
        ),
        migrations.CreateModel(
            name='Month',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(choices=[('APRIL', 'April'), ('MAY', 'May'), ('JUNE', 'June'), ('JULY', 'July'), ('AUGUST', 'August'), ('SEPTEMBER', 'September'), ('OCTOBER', 'October'), ('NOVEMBER', 'November'), ('DECEMBER', 'December'), ('JANUARY', 'January'), ('FEBRUARY', 'February'), ('MARCH', 'March')], default='APRIL', max_length=10)),
            ],
        ),
        migrations.CreateModel(
            name='SchoolFeeComponent',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField(verbose_name='title')),
                ('amount', models.IntegerField(default=0, verbose_name='amount')),
                ('parentFeeDefinition', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='fee_second_app.FeeDefinition', verbose_name='parentFeeDefinition')),
            ],
            options={
                'db_table': 'school_fee_component',
            },
        ),
        migrations.CreateModel(
            name='SchoolMonthlyFeeComponent',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.IntegerField(default=0, verbose_name='amount')),
                ('parentMonth', models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, to='fee_second_app.Month', verbose_name='parentMonth')),
                ('parentSchoolFeeComponent', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='fee_second_app.SchoolFeeComponent', verbose_name='parentStudentFeeComponent')),
            ],
            options={
                'db_table': 'school_fee_component_monthly',
            },
        ),
        migrations.CreateModel(
            name='StudentFeeComponent',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.IntegerField(verbose_name='amount')),
                ('bySchoolRules', models.BooleanField(default=True, verbose_name='bySchoolRules')),
                ('remark', models.TextField()),
                ('parentFeeDefinition', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='fee_second_app.FeeDefinition', verbose_name='parentFeeDefinition')),
                ('parentStudent', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='student_app.Student', verbose_name='parentStudent')),
            ],
            options={
                'db_table': 'student_fee_component',
            },
        ),
        migrations.CreateModel(
            name='StudentMonthlyFeeComponent',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.IntegerField(default=0, verbose_name='amount')),
                ('parentMonth', models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, to='fee_second_app.Month', verbose_name='parentMonth')),
                ('parentStudentFeeComponent', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='fee_second_app.StudentFeeComponent', verbose_name='parentStudentFeeComponent')),
            ],
            options={
                'db_table': 'student_fee_component_monthly',
            },
        ),
        migrations.CreateModel(
            name='SubConcession',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.IntegerField()),
                ('parentConcession', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='fee_second_app.Concession', verbose_name='parentConcession')),
                ('parentStudentFeeComponent', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='fee_second_app.StudentFeeComponent', verbose_name='parentStudent')),
            ],
            options={
                'db_table': 'sub_concession',
            },
        ),
        migrations.CreateModel(
            name='SubConcessionMonthly',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.IntegerField()),
                ('parentMonth', models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, to='fee_second_app.Month', verbose_name='parentMonth')),
                ('parentSubConcession', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='fee_second_app.SubConcession', verbose_name='parentSubConcession')),
            ],
            options={
                'db_table': 'sub_concession_monthly',
            },
        ),
        migrations.CreateModel(
            name='SubFeeReceipt',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.IntegerField(default=0, verbose_name='amount')),
                ('parentFeeReceipt', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='fee_second_app.FeeReceipt', verbose_name='parentFeeReceipt')),
                ('parentStudentFeeComponent', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='fee_second_app.StudentFeeComponent', verbose_name='parentStudentFeeComponent')),
            ],
            options={
                'db_table': 'sub_fee_receipt',
            },
        ),
        migrations.CreateModel(
            name='SubFeeReceiptMonthly',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.IntegerField(default=0, verbose_name='amount')),
                ('parentMonth', models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, to='fee_second_app.Month', verbose_name='parentMonth')),
                ('parentSubFeeReceipt', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='fee_second_app.SubFeeReceipt', verbose_name='parentSubFeeReceipt')),
            ],
            options={
                'db_table': 'sub_fee_receipt_monthly',
            },
        ),
        migrations.AddField(
            model_name='feedefinition',
            name='parentFeeType',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='fee_second_app.FeeType', verbose_name='parentFeeType'),
        ),
        migrations.AddField(
            model_name='feedefinition',
            name='parentSchool',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.School', verbose_name='parentSchool'),
        ),
        migrations.AddField(
            model_name='feedefinition',
            name='parentSession',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.Session', verbose_name='parentSession'),
        ),
        migrations.AddField(
            model_name='classbasedfilter',
            name='parentSchoolFeeComponent',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='fee_second_app.SchoolFeeComponent'),
        ),
        migrations.AddField(
            model_name='busstopbasedfilter',
            name='parentSchoolFeeComponent',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='fee_second_app.SchoolFeeComponent'),
        ),
        migrations.RunPython(delete_aatifkhan_profile),
        migrations.RunPython(initialize_fee_database),
    ]
