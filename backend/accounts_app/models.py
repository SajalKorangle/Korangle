from django.db import models

# Create your models here.
from employee_app.models import Employee
from school_app.model.models import School,Session

import os
from django.utils.timezone import now
from datetime import datetime, date

def upload_image_to(instance, filename):
    filename_base, filename_ext = os.path.splitext(filename)
    return 'accounts/%s/transaction_image/%s%s' % (instance.id, now().timestamp(), filename_ext.lower())

class Heads(models.Model):
    title = models.TextField(null = False, verbose_name='title')

    class Meta:
        db_table = 'heads'

class EmployeeAmountPermission(models.Model):

    parentEmployee = models.ForeignKey(Employee, on_delete=models.CASCADE, null=False, verbose_name='parentEmployee')
    restrictedAmount = models.IntegerField(null=True, blank=True, default=0, verbose_name='permittedAmount')

    
    class Meta:
        db_table = 'employee_amount_permission'

class Accounts(models.Model):
    
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE, null=False, verbose_name='parentSchool')
    
    GROUP_TYPE = 'GROUP'
    ACCOUNT_TYPE = 'ACCOUNT'
    CHOICES = (
        (GROUP_TYPE, 'GROUP'),
        (ACCOUNT_TYPE, 'ACCOUNT'),
    )
    accountType = models.TextField(null=False, choices=CHOICES, default=ACCOUNT_TYPE)

    class Meta:
        db_table = 'accounts'

class AccountSession(models.Model):
    
    parentAccount = models.ForeignKey(Accounts, on_delete=models.CASCADE, null=False, verbose_name='parentAccount')
    parentSession = models.ForeignKey(Session, on_delete=models.CASCADE, null=False, verbose_name='parentSession')
    title = models.TextField(null=False, verbose_name='title')
    balance = models.IntegerField(null=True, blank=True, verbose_name='balance')
    parentGroup = models.ForeignKey('self', null=True, verbose_name='parentGroup')
    parentHead = models.ForeignKey(Heads, null=False, verbose_name='parentHead')

    class Meta:
        db_table = 'account_session'

class Transaction(models.Model):
    
    parentEmployee = models.ForeignKey(Employee, on_delete=models.CASCADE, null=False, verbose_name='parentEmployee')
    voucherNumber = models.IntegerField(null=True, blank=True, verbose_name='voucherNumber')
    remark = models.TextField(null=True, blank=True, verbose_name='remark')
    transactionDate = models.DateField(null=True, verbose_name='transactionDate')

    APPROVED_STATUS = 'APPROVED'
    PENDING_STATUS = 'PENDING'
    DECLINED_STATUS = 'DECLINED'
    USED_STATUS = 'USED'

    STATUS = (
        (APPROVED_STATUS, 'APPROVED'),
        (PENDING_STATUS, 'PENDING'),
        (DECLINED_STATUS, 'DECLINED'),
        (USED_STATUS, 'DECLINED'),
    )

    transactionStatus = models.TextField(null=True, choices=STATUS, default=USED_STATUS)
    
    class Meta:
        db_table = 'transaction'

class ApprovalRequests(models.Model):
    
    parentEmployee = models.ForeignKey(Employee, on_delete=models.CASCADE, null=False, verbose_name='parentEmployee')
    amount = models.IntegerField(null=True, blank=True)
    parentTransaction = models.ForeignKey(Transaction, null=False, on_delete=models.CASCADE, verbose_name='parentTransaction')

    class Meta:
        db_table = 'approval_requests'

class TransactionAccountDetails(models.Model):

    parentTransaction = models.ForeignKey(Transaction, null=False, on_delete=models.CASCADE, verbose_name='parentTransaction')
    account = models.ForeignKey(Accounts, null=False, on_delete=models.CASCADE)
    amount = models.IntegerField(null=True, blank=True)

    CREDIT_TYPE = 'CREDIT'
    DEBIT_TYPE = 'DEBIT'
    CHOICES = (
        (CREDIT_TYPE, 'CREDIT'),
        (DEBIT_TYPE, 'DEBIT'),
    )

    transactionType = models.TextField(null=False, choices=CHOICES)

    class Meta:
        db_table = 'transaction_account_details'

class TransactionImages(models.Model):
    
    parentTransaction = models.ForeignKey(Transaction, null=False, on_delete=models.CASCADE, verbose_name='parentTransaction')
    imageURL = models.ImageField('transaction_image', upload_to = upload_image_to,blank = True,null=True)
    
    BILL_TYPE = 'BILL'
    QUOTATION_TYPE = 'QUOTATION'
    CHOICES = (
        (BILL_TYPE, 'BILL'),
        (QUOTATION_TYPE, 'QUOTATION'),
    )

    iamgeType = models.TextField(null=False, choices=CHOICES)

    class Meta:
        db_table = 'transaction_images'