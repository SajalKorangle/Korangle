# Generated by Django 3.2.5 on 2021-10-15 05:30

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('school_app', '0002_remove_school_smsid'),
    ]

    operations = [
        migrations.CreateModel(
            name='CashfreeDailyJobsReport',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(auto_now_add=True, unique=True)),
                ('status', models.CharField(blank=True, choices=[('INITIATED', 'INITIATED'), ('SUCCESS', 'SUCCESS')], default='INITIATED', max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='SchoolMerchantAccount',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('vendorId', models.CharField(max_length=20, unique=True)),
                ('parentSchool', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='SchoolMerchantAccountList', to='school_app.school', unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('orderId', models.CharField(max_length=20, primary_key=True, serialize=False, unique=True)),
                ('amount', models.PositiveIntegerField()),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('Completed', 'Completed'), ('Failed', 'Failed'), ('Refund Pending', 'Refund Pending'), ('Refund Initiated', 'Refund Initiated'), ('Refunded', 'Refunded')], default='Pending', max_length=30)),
                ('referenceId', models.CharField(blank=True, max_length=30, null=True)),
                ('refundId', models.PositiveBigIntegerField(blank=True, null=True)),
                ('dateTime', models.DateTimeField(auto_now_add=True)),
                ('parentUser', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
