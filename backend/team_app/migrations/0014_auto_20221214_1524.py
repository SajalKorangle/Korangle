# Generated by Django 3.2.5 on 2022-12-14 09:54

from django.db import migrations
from team_app.db_script.add_task_update_via_excel import add_task_update_via_excel


class Migration(migrations.Migration):

    dependencies = [
        ('team_app', '0013_auto_20221114_0950'),
    ]

    operations = [
        migrations.RunPython(add_task_update_via_excel),
    ]
