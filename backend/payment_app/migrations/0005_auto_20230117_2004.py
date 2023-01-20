# Generated by Django 3.2.5 on 2023-01-17 14:34

from django.db import migrations, models
import django.db.models.deletion
from payment_app.db_script.add_payment_gateway_details import add_payment_gateway_details


class Migration(migrations.Migration):

    dependencies = [
        ('payment_app', '0004_alter_schoolmerchantaccount_percentageofplatformfeeonschool'),
    ]

    operations = [
        migrations.CreateModel(
            name='ModeOfPayment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('apiCode', models.CharField(max_length=20)),
                ('enabled', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='PaymentGateway',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='ModeOfPaymentCharges',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('chargeType', models.CharField(choices=[('Percentage', 'Percentage'), ('Flat', 'Flat')], default='Flat', max_length=30)),
                ('charge', models.DecimalField(decimal_places=3, default=0, max_digits=6)),
                ('minimumAmount', models.IntegerField(default=0)),
                ('maximumAmount', models.IntegerField(default=-1)),
                ('parentModeOfPayment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='payment_app.modeofpayment')),
            ],
        ),
        migrations.AddField(
            model_name='modeofpayment',
            name='parentPaymentGateway',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='payment_app.paymentgateway'),
        ),
        migrations.RunPython(add_payment_gateway_details)
    ]
