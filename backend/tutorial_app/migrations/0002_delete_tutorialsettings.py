# Generated by Django 3.2.5 on 2021-08-11 09:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tutorial_app', '0001_initial'),
        ('sms_app', '0002_DLT_required_changes')
    ]

    operations = [
        migrations.DeleteModel(
            name='TutorialSettings',
        ),
    ]
