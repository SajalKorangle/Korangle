# Generated by Django 3.2.5 on 2022-03-25 12:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication_app', '0003_rename_user_id_devicelist_parentuser'),
    ]

    operations = [
        migrations.AddField(
            model_name='devicelist',
            name='mobile',
            field=models.BigIntegerField(default=0),
        ),
    ]
