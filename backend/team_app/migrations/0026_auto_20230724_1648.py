# Generated by Django 3.2.5 on 2023-07-24 11:18

from django.db import migrations
from team_app.db_script.add_count_all_student_attendance import count_all_student_attendance

class Migration(migrations.Migration):

    dependencies = [
        ('team_app', '0025_auto_20230706_1333'),
    ]

    operations = [
        migrations.RunPython(count_all_student_attendance),
    ]
