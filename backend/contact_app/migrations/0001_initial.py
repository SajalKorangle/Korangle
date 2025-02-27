# Generated by Django 3.2.5 on 2021-11-20 11:29

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ContactDetail',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('mobileNumber', models.CharField(max_length=12)),
                ('firstName', models.CharField(max_length=100)),
                ('lastName', models.CharField(max_length=100)),
                ('emailId', models.EmailField(max_length=254, null=True,  blank=True)),
                ('schoolName', models.TextField(null=True)),
                ('remarks', models.TextField(null=True)),
                ('createdDateTime', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'contact_detail',
            },
        ),
    ]
