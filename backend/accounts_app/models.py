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


def upload_image_to_1(instance, filename):
    filename_base, filename_ext = os.path.splitext(filename)
    return 'accounts/%s/approval_image/%s%s' % (instance.id, now().timestamp(), filename_ext.lower())

class Heads(models.Model):
    title = models.TextField()

    class Meta:
        db_table = 'heads'

class EmployeeAmountPermission(models.Model):

    parentEmployee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    restrictedAmount = models.IntegerField(default=0) 
    
    class Meta:
        db_table = 'employee_amount_permission'


class Accounts(models.Model):
    
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE)
    
    GROUP_TYPE = 'GROUP'
    ACCOUNT_TYPE = 'ACCOUNT'
    CHOICES = (
        (GROUP_TYPE, 'GROUP'),
        (ACCOUNT_TYPE, 'ACCOUNT'),
    )
    accountType = models.TextField(choices=CHOICES, default=ACCOUNT_TYPE)
    title = models.TextField()
    

    class Meta:
        db_table = 'accounts'

class AccountSession(models.Model):
    
    parentAccount = models.ForeignKey(Accounts, on_delete=models.CASCADE, related_name='acccountSessions')
    parentSession = models.ForeignKey(Session, on_delete=models.CASCADE,)
    balance = models.IntegerField(null=True, blank=True,)
    parentGroup = models.ForeignKey(Accounts, null=True, related_name='groupAcccountSessions')    # on delete?
    parentHead = models.ForeignKey(Heads)

    class Meta:
        db_table = 'account_session'

class Transaction(models.Model):
    
    parentEmployee = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True)
    voucherNumber = models.IntegerField(null=True, blank=True)
    remark = models.TextField(null=True, blank=True)
    transactionDate = models.DateField(null=True)
    approvalId = models.IntegerField(null=True, blank=True)
    
    class Meta:
        db_table = 'transaction'

class Approval(models.Model):
    
    parentEmployeeRequestedBy = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='ApprovalList')
    parentEmployeeApprovedBy = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='ApprovedList')
    approvalId = models.IntegerField(null=True, blank=True) 
    parentTransaction = models.ForeignKey(Transaction, null=True, on_delete=models.CASCADE)
    requestedGenerationDateTime = models.DateField(null=True) # should be auto add?
    approvedGenerationDateTime = models.DateField(null=True)
    remark = models.TextField(null=True, blank=True)
    autoAdd = models.BooleanField(default=False)
    transactionDate = models.DateField(null=True)
    

    APPROVED_STATUS = 'APPROVED'
    PENDING_STATUS = 'PENDING'
    DECLINED_STATUS = 'DECLINED'

    STATUS = (
        (APPROVED_STATUS, 'APPROVED'),
        (PENDING_STATUS, 'PENDING'),
        (DECLINED_STATUS, 'DECLINED'),
    )

    requestStatus = models.TextField(null=True, choices=STATUS, default=PENDING_STATUS) # why request status will be null

    class Meta:
        db_table = 'approval'


class ApprovalAccountDetails(models.Model):
    
    parentApproval = models.ForeignKey(Approval, on_delete=models.CASCADE)
    parentAccount = models.ForeignKey(Accounts, on_delete=models.CASCADE)
    amount = models.IntegerField(null=True, blank=True)

    CREDIT_TYPE = 'CREDIT'
    DEBIT_TYPE = 'DEBIT'
    ACCOUNT_TYPE = (
        (CREDIT_TYPE, 'CREDIT'),
        (DEBIT_TYPE, 'DEBIT'),
    )

    transactionType = models.TextField(choices=ACCOUNT_TYPE)

    class Meta:
        db_table = 'approval_account_details'


class ApprovalImages(models.Model):
    
    parentApproval = models.ForeignKey(Approval, on_delete=models.CASCADE)
    imageURL = models.ImageField('approval_image', upload_to = upload_image_to_1, blank = True, null=True) # whu null
    
    BILL_TYPE = 'BILL'
    QUOTATION_TYPE = 'QUOTATION'
    DOCUMENT_TYPE = (
        (BILL_TYPE, 'BILL'),
        (QUOTATION_TYPE, 'QUOTATION'),  
    )

    imageType = models.TextField(null=False, choices=DOCUMENT_TYPE)
    orderNumber = models.IntegerField(null=False, default=0, verbose_name='orderNumber')


    class Meta:
        db_table = 'approval_images'


class TransactionAccountDetails(models.Model):

    parentTransaction = models.ForeignKey(Transaction, on_delete=models.CASCADE)
    parentAccount = models.ForeignKey(Accounts, on_delete=models.CASCADE)
    amount = models.IntegerField(null=True, blank=True)

    CREDIT_TYPE = 'CREDIT'
    DEBIT_TYPE = 'DEBIT'
    ACCOUNT_TYPE = (
        (CREDIT_TYPE, 'CREDIT'),
        (DEBIT_TYPE, 'DEBIT'),
    )

    transactionType = models.TextField(choices=ACCOUNT_TYPE)

    class Meta:
        db_table = 'transaction_account_details'

class TransactionImages(models.Model):
    
    parentTransaction = models.ForeignKey(Transaction, on_delete=models.CASCADE)
    imageURL = models.ImageField(upload_to = upload_image_to, blank = True, null=True)
    orderNumber = models.IntegerField(default=0)
    
    BILL_TYPE = 'BILL'
    QUOTATION_TYPE = 'QUOTATION'
    DOCUMENT_TYPE = (
        (BILL_TYPE, 'BILL'),
        (QUOTATION_TYPE, 'QUOTATION'),
    )

    imageType = models.TextField(choices=DOCUMENT_TYPE)

    class Meta:
        db_table = 'transaction_images'

class LockAccounts(models.Model):

    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE)
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT)

    class Meta:
        db_table = 'lock_accounts'
        unique_together = ('parentSchool', 'parentSession')
