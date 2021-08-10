# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2021-03-19 10:41
from __future__ import unicode_literals

import accounts_app.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('employee_app', '0012_auto_20200409_1653'),
        ('school_app', '0042_schoolsummary'),
    ]

    operations = [
        migrations.CreateModel(
            name='Accounts',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('accountType', models.TextField(choices=[('GROUP', 'GROUP'), ('ACCOUNT', 'ACCOUNT')], default='ACCOUNT')),
                ('title', models.TextField()),
                ('parentSchool', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school_app.School')),
            ],
            options={
                'db_table': 'accounts',
            },
        ),
        migrations.CreateModel(
            name='AccountSession',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('openingBalance', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('currentBalance', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('parentAccount', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='acccountSessions', to='accounts_app.Accounts')),
                ('parentGroup', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='groupAcccountSessions', to='accounts_app.Accounts')),
            ],
            options={
                'db_table': 'account_session',
            },
        ),
        migrations.CreateModel(
            name='Approval',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('approvalId', models.IntegerField(blank=True, null=True)),
                ('requestedGenerationDateTime', models.DateField(null=True)),
                ('approvedGenerationDateTime', models.DateField(null=True)),
                ('remark', models.TextField(blank=True, null=True)),
                ('autoAdd', models.BooleanField(default=False)),
                ('transactionDate', models.DateField(null=True)),
                ('requestStatus', models.TextField(choices=[('APPROVED', 'APPROVED'), ('PENDING', 'PENDING'), ('DECLINED', 'DECLINED')], default='PENDING', null=True)),
                ('parentEmployeeApprovedBy', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='ApprovedList', to='employee_app.Employee')),
                ('parentEmployeeRequestedBy', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='ApprovalList', to='employee_app.Employee')),
            ],
            options={
                'db_table': 'approval',
            },
        ),
        migrations.CreateModel(
            name='ApprovalAccountDetails',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('transactionType', models.TextField(choices=[('CREDIT', 'CREDIT'), ('DEBIT', 'DEBIT')])),
                ('parentAccount', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts_app.Accounts')),
                ('parentApproval', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts_app.Approval')),
            ],
            options={
                'db_table': 'approval_account_details',
            },
        ),
        migrations.CreateModel(
            name='ApprovalImages',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('imageURL', models.ImageField(blank=True, null=True, upload_to=accounts_app.models.upload_image_to_1, verbose_name='approval_image')),
                ('imageType', models.TextField(choices=[('BILL', 'BILL'), ('QUOTATION', 'QUOTATION')])),
                ('orderNumber', models.IntegerField(default=0, verbose_name='orderNumber')),
                ('parentApproval', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts_app.Approval')),
            ],
            options={
                'db_table': 'approval_images',
            },
        ),
        migrations.CreateModel(
            name='EmployeeAmountPermission',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('restrictedAmount', models.IntegerField(default=0)),
                ('parentEmployee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='employee_app.Employee')),
            ],
            options={
                'db_table': 'employee_amount_permission',
            },
        ),
        migrations.CreateModel(
            name='Heads',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField()),
            ],
            options={
                'db_table': 'heads',
            },
        ),
        migrations.CreateModel(
            name='LockAccounts',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parentSchool', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school_app.School')),
                ('parentSession', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='school_app.Session')),
            ],
            options={
                'db_table': 'lock_accounts',
            },
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('voucherNumber', models.IntegerField(blank=True, null=True)),
                ('remark', models.TextField(blank=True, null=True)),
                ('transactionDate', models.DateField(null=True)),
                ('approvalId', models.IntegerField(blank=True, null=True)),
                ('parentEmployee', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='employee_app.Employee')),
                ('parentSchool', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='school_app.School')),
            ],
            options={
                'db_table': 'transaction',
            },
        ),
        migrations.CreateModel(
            name='TransactionAccountDetails',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('transactionType', models.TextField(choices=[('CREDIT', 'CREDIT'), ('DEBIT', 'DEBIT')])),
                ('parentAccount', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='accounts_app.Accounts')),
                ('parentTransaction', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts_app.Transaction')),
            ],
            options={
                'db_table': 'transaction_account_details',
            },
        ),
        migrations.CreateModel(
            name='TransactionImages',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('imageURL', models.ImageField(blank=True, null=True, upload_to=accounts_app.models.upload_image_to)),
                ('orderNumber', models.IntegerField(default=0)),
                ('imageType', models.TextField(choices=[('BILL', 'BILL'), ('QUOTATION', 'QUOTATION')])),
                ('parentTransaction', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts_app.Transaction')),
            ],
            options={
                'db_table': 'transaction_images',
            },
        ),
        migrations.AddField(
            model_name='approval',
            name='parentTransaction',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='accounts_app.Transaction'),
        ),
        migrations.AddField(
            model_name='accountsession',
            name='parentHead',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts_app.Heads'),
        ),
        migrations.AddField(
            model_name='accountsession',
            name='parentSession',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school_app.Session'),
        ),
        migrations.AlterUniqueTogether(
            name='lockaccounts',
            unique_together=set([('parentSchool', 'parentSession')]),
        ),
    ]
