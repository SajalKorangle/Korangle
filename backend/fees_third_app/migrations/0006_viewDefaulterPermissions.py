# Generated by Django 3.2.5 on 2022-11-10 04:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('employee_app', '0003_employee_isnonsalariedemployee'),
        ('fees_third_app', '0005_auto_20220709_1049'),
    ]

    operations = [
        migrations.CreateModel(
            name='ViewDefaulterPermissions',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('userType', models.CharField(choices=[('Admin', 'Admin'), ('Teacher', 'Teacher')], default='Admin', max_length=10)),
                ('viewSummary', models.BooleanField(default=True)),
                ('viewStudent', models.BooleanField(default=True)),
                ('parentEmployeePermission', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='employee_app.employeepermission', unique=True, verbose_name='parentEmployeePermission')),
            ],
            options={
                'db_table': 'view_defaulter_permissions',
            },
        ),
    ]
