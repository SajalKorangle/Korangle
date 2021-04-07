# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-04-07 07:47
from __future__ import unicode_literals

import accounts_app.models
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
from accounts_app.db_script.db_models_fix import approval_model_fix, delete_inconsistant_transactions


class Migration(migrations.Migration):

    dependencies = [
        ('school_app', '0042_schoolsummary'),
        ('accounts_app', '0004_auto_20210402_0839'),
    ]

    operations = [
        migrations.AddField(
            model_name='approval',
            name='parentSchool',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='school_app.School'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='approval',
            name='parentSession',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='school_app.Session'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='approval',
            name='approvalId',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='approval',
            name='requestStatus',
            field=models.TextField(choices=[('APPROVED', 'APPROVED'), ('PENDING', 'PENDING'), ('DECLINED', 'DECLINED')], default='PENDING'),
        ),
        migrations.AlterField(
            model_name='approval',
            name='requestedGenerationDateTime',
            field=models.DateField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='approvalaccountdetails',
            name='amount',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='approvalimages',
            name='imageURL',
            field=models.ImageField(default='', upload_to=accounts_app.models.upload_image_to_1, verbose_name='approval_image'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='transaction',
            name='parentSchool',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school_app.School'),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='transactionDate',
            field=models.DateField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='transaction',
            name='voucherNumber',
            field=models.IntegerField(blank=True, default=0),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='transactionaccountdetails',
            name='amount',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='transactionimages',
            name='imageURL',
            field=models.ImageField(default='', upload_to=accounts_app.models.upload_image_to),
            preserve_default=False,
        ),
        migrations.RunPython(approval_model_fix),
        migrations.RunPython(delete_inconsistant_transactions),
    ]
