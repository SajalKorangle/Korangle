# Generated by Django 3.2.5 on 2023-09-13 04:49

from django.db import migrations
from team_app.db_script.add_view_book_flow_library_module_phase2 import add_view_book_flow_library_module_phase2

class Migration(migrations.Migration):

    dependencies = [
        ('team_app', '0028_auto_20230910_0159'),
    ]

    operations = [
        migrations.RunPython(add_view_book_flow_library_module_phase2)
    ]
