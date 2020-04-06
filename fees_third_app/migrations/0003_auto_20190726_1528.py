# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2019-07-26 09:58
from __future__ import unicode_literals

from django.db import migrations, models

from fees_third_app.db_script.modify_modeOfPayment import modify_modeOfPayment


class Migration(migrations.Migration):

    dependencies = [
        ('fees_third_app', '0002_auto_20190614_1531'),
    ]

    operations = [
        migrations.AlterField(
            model_name='feereceipt',
            name='checkNumber',
            field=models.IntegerField(null=True, verbose_name='chequeNumber'),
        ),
        migrations.RenameField(
            model_name='feereceipt',
            old_name='checkNumber',
            new_name='chequeNumber',
        ),
        migrations.AlterField(
            model_name='feereceipt',
            name='modeOfPayment',
            field=models.CharField(choices=[('Cash', 'Cash'), ('Cheque', 'Cheque'), ('Online', 'Online')], max_length=20, null=True),
        ),
        migrations.RunPython(modify_modeOfPayment),
    ]
