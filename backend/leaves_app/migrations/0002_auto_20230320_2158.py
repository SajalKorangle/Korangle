# Generated by Django 3.2.5 on 2023-03-20 16:28

import django.contrib.postgres.fields.citext
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('school_app', '0004_auto_20221216_2152'),
        ('leaves_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='schoolleavetype',
            name='assignedLeavesMonthWise',
            field=models.TextField(default='{}', verbose_name='Leaves Vs Month'),
        ),
        migrations.AlterField(
            model_name='schoolleavetype',
            name='leaveTypeName',
            field=django.contrib.postgres.fields.citext.CITextField(default='invalid_type', verbose_name='leave_name'),
        ),
        migrations.AlterUniqueTogether(
            name='schoolleavetype',
            unique_together={('color', 'parentSchool'), ('leaveTypeName', 'parentSchool')},
        ),
    ]
