# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-02-09 10:34
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts_app', '0002_auto_20210209_1431'),
    ]

    operations = [
        migrations.RenameField(
            model_name='transactionimages',
            old_name='iamgeType',
            new_name='imageType',
        ),
        migrations.AlterField(
            model_name='accountsession',
            name='parentAccount',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='parentAccount', to='accounts_app.Accounts', verbose_name='parentAccount'),
        ),
        migrations.AlterField(
            model_name='accountsession',
            name='parentGroup',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='parentGroup', to='accounts_app.Accounts', verbose_name='parentGroup'),
        ),
    ]
