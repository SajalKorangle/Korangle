# Generated by Django 3.2.5 on 2021-11-24 10:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('school_app', '0003_schoolexpiryinformationjobsreport'),
        ('information_app', '0002_delete_sentupdatetype'),
    ]

    operations = [
        migrations.CreateModel(
            name='AdminInformation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField(default='', verbose_name='content')),
                ('sentDateTime', models.DateTimeField(auto_now_add=True, verbose_name='sentDateTime')),
                ('smsCount', models.IntegerField(default=0, verbose_name='smsCount')),
                ('notificationCount', models.IntegerField(default=0, verbose_name='notificationCount')),
                ('employeeList', models.TextField(default='', verbose_name='employeeList')),
                ('parentSchool', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='school_app.school', verbose_name='parentSchool')),
            ],
            options={
                'db_table': 'admin_information',
            },
        ),
    ]
