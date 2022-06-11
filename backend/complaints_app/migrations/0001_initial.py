# Generated by Django 3.2.5 on 2022-06-06 12:57

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('student_app', '0002_auto_20220126_1119'),
        ('employee_app', '0002_alter_employee_parentschool'),
        ('school_app', '0003_schoolexpiryinformationjobsreport'),
    ]

    operations = [
        migrations.CreateModel(
            name='Complaint',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dateSent', models.DateTimeField(auto_now_add=True)),
                ('title', models.TextField()),
                ('parentEmployee', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='employee_app.employee')),
                ('parentSchool', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school_app.school')),
            ],
            options={
                'db_table': 'complaint',
            },
        ),
        migrations.CreateModel(
            name='SchoolComplaintStatus',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
                ('parentSchool', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school_app.school')),
            ],
            options={
                'db_table': 'school_complaint_status',
            },
        ),
        migrations.CreateModel(
            name='SchoolComplaintType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
                ('defaultText', models.TextField()),
                ('parentSchool', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school_app.school')),
                ('parentSchoolComplaintStatusDefault', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='complaints_app.schoolcomplaintstatus')),
            ],
            options={
                'db_table': 'school_complaint_type',
            },
        ),
        migrations.CreateModel(
            name='StatusComplaintType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parentSchoolComplaintStatus', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='complaints_app.schoolcomplaintstatus')),
                ('parentSchoolComplaintType', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='complaints_app.schoolcomplainttype')),
            ],
            options={
                'db_table': 'status_complaintType',
            },
        ),
        migrations.CreateModel(
            name='EmployeeComplaintType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parentEmployee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='employee_app.employee')),
                ('parentSchoolComplaintType', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='complaints_app.schoolcomplainttype')),
            ],
            options={
                'db_table': 'employee_complaintType',
            },
        ),
        migrations.CreateModel(
            name='EmployeeComplaint',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parentComplaint', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='complaints_app.complaint')),
                ('parentEmployee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='employee_app.employee')),
            ],
            options={
                'db_table': 'employee_complaint',
            },
        ),
        migrations.CreateModel(
            name='CountAllComplaints',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('formatName', models.TextField()),
                ('rows', models.JSONField()),
                ('cols', models.JSONField()),
                ('parentSchool', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school_app.school')),
            ],
            options={
                'db_table': 'count_all_parentSupport',
            },
        ),
        migrations.AddField(
            model_name='complaint',
            name='parentSchoolComplaintStatus',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='complaints_app.schoolcomplaintstatus'),
        ),
        migrations.AddField(
            model_name='complaint',
            name='parentSchoolComplaintType',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='complaints_app.schoolcomplainttype'),
        ),
        migrations.AddField(
            model_name='complaint',
            name='parentStudent',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='student_app.student'),
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField()),
                ('createdAt', models.DateTimeField(auto_now_add=True)),
                ('parentComplaint', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='complaints_app.complaint')),
                ('parentEmployee', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='employee_app.employee')),
                ('parentStudent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='student_app.student')),
            ],
            options={
                'db_table': 'complaint_comment',
            },
        ),
    ]
