# Generated by Django 3.2.5 on 2023-03-30 17:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('school_app', '0004_auto_20221216_2152'),
        ('leaves_app', '0002_auto_20230326_1625'),
    ]

    operations = [
        migrations.CreateModel(
            name='SchoolLeavePlan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('leavePlanName', models.TextField(default='invalid_type', verbose_name='leave_plan_name')),
                ('parentSchool', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='school_app.school', verbose_name='parentSchool')),
            ],
            options={
                'db_table': 'school_leave_plan',
                'unique_together': {('leavePlanName', 'parentSchool')},
            },
        ),
        migrations.CreateModel(
            name='SchoolLeavePlanToSchoolLeaveType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parentSchoolLeavePlan', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='leaves_app.schoolleaveplan', verbose_name='parentSchoolLeavePlan')),
                ('parentSchoolLeaveType', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='leaves_app.schoolleavetype', verbose_name='parentSchoolLeaveType')),
            ],
            options={
                'db_table': 'school_leave_plan_leave_type',
                'unique_together': {('parentSchoolLeavePlan', 'parentSchoolLeaveType')},
            },
        ),
    ]
