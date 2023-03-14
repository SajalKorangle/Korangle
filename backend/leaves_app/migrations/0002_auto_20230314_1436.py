# Generated by Django 3.2.5 on 2023-03-14 09:06

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
        migrations.AddField(
            model_name='schoolleavetype',
            name='divisionFactor',
            field=models.IntegerField(default=1),
        ),
        migrations.AddField(
            model_name='schoolleavetype',
            name='divisionFactorType',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='schoolleavetype',
            name='salaryComponents',
            field=models.TextField(default='{}', verbose_name='Leaves Vs Month'),
        ),
        migrations.AlterUniqueTogether(
            name='schoolleavetype',
            unique_together={('leaveTypeName', 'parentSchool')},
        ),
    ]
