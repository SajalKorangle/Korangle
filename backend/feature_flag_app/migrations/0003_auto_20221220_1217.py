# Generated by Django 3.2.5 on 2022-12-20 06:47

from django.db import migrations
from feature_flag_app.db_script.add_easebuzz_feature_flag import add_easebuzz_feature_flag

class Migration(migrations.Migration):

    dependencies = [
        ('feature_flag_app', '0002_auto_20221214_1518'),
    ]

    operations = [
        migrations.RunPython(add_easebuzz_feature_flag),
    ]
