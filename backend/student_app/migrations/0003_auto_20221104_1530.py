# Generated by Django 3.2.5 on 2022-11-04 10:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('student_app', '0002_auto_20220126_1119'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='student',
            name='totalFees',
        ),
        migrations.RemoveField(
            model_name='studentsection',
            name='attendance',
        ),
    ]
