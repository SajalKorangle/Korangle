# Generated by Django 3.2.5 on 2023-08-14 07:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fees_third_app', '0008_auto_20230804_1551'),
    ]

    operations = [
        migrations.AlterField(
            model_name='feereceiptbook',
            name='receiptNumberPrefix',
            field=models.TextField(blank=True, default=''),
        ),
    ]
