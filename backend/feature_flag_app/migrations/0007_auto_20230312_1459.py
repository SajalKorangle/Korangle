# Generated by Django 3.2.5 on 2023-03-12 09:29

from django.db import migrations
from feature_flag_app.db_script.add_easebuzz_in_pay_fees_feature_flag import add_easebuzz_in_pay_fees_feature_flag


class Migration(migrations.Migration):

    dependencies = [
        ('feature_flag_app', '0006_merge_0005_auto_20230225_1554_0005_auto_20230301_1351'),
    ]

    operations = [
        migrations.RunPython(add_easebuzz_in_pay_fees_feature_flag)
    ]
