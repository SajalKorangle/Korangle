# Generated by Django 3.2.5 on 2023-02-20 10:56

from django.db import migrations
from feature_flag_app.db_script.add_salary2_feature_flag import add_salary2_feature_flag

class Migration(migrations.Migration):

    dependencies = [
        ('feature_flag_app', '0003_auto_20221220_1217'),
    ]

    operations = [
        migrations.RunPython(add_salary2_feature_flag)
    ]
