from django.db import models

# Create your models here.
from employee_app.models import Employee
from school_app.model.models import School, Session
from django.db.models import Max

from django.dispatch import receiver
from django.db.models.signals import pre_save, post_save

import os
from django.utils.timezone import now
from common.common import BasePermission


def upload_image_to(instance, filename):
    filename_base, filename_ext = os.path.splitext(filename)
    return 'accounts_app/TransactionImages/imageURL/%s%s' % (now().timestamp(), filename_ext.lower())


def upload_image_to_1(instance, filename):
    filename_base, filename_ext = os.path.splitext(filename)
    return 'accounts_app/ApprovalImages/imageURL/%s%s' % (now().timestamp(), filename_ext.lower())


class Heads(models.Model):
    title = models.TextField()

    class Meta:
        db_table = 'heads'


class EmployeeAmountPermission(models.Model):

    parentEmployee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    restrictedAmount = models.BigIntegerField(default=0)

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
        unique_together = ('parentSchool', 'title')


class AccountSession(models.Model):

    parentAccount = models.ForeignKey(Accounts, on_delete=models.CASCADE, related_name='acccountSessions')
    parentSession = models.ForeignKey(Session, on_delete=models.CASCADE,)
    openingBalance = models.DecimalField(null=True, blank=True, max_digits=10, decimal_places=2)
    currentBalance = models.DecimalField(null=True, blank=True, max_digits=10, decimal_places=2)
    parentGroup = models.ForeignKey(Accounts, null=True, related_name='groupAcccountSessions', on_delete=models.SET_NULL)
    parentHead = models.ForeignKey(Heads, on_delete=models.PROTECT)

    class Meta:
        db_table = 'account_session'
        unique_together = ('parentAccount', 'parentSession')


@receiver(pre_save, sender=AccountSession)
def accountSessionPreSave(sender, instance, **kwargs):
    if kwargs['raw']:
        return
    if instance.openingBalance is None:
        instance.openingBalance = 0
    if (instance.id is None):
        instance.currentBalance = instance.openingBalance
    else:
        instance.currentBalance += instance.openingBalance - AccountSession.objects.get(id=instance.id).openingBalance


class Transaction(models.Model):

    parentEmployee = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='transactionsList')
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE, related_name='transactionList')
    voucherNumber = models.IntegerField(blank=True)
    remark = models.TextField(null=True, blank=True)
    transactionDate = models.DateField()
    approvalId = models.IntegerField(null=True, blank=True)

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id', 'parentEmployee__parentSchool__id']

    class Meta:
        db_table = 'transaction'


@receiver(pre_save, sender=Transaction)
def transactionPreSave(sender, instance, **kwargs):
    if(kwargs['raw']):
        return
    if instance.id is None:
        ## Generating Voucher Number Starts ##
        transactionSession = Session.objects.get(startDate__lte=instance.transactionDate, endDate__gte=instance.transactionDate)
        last_voucher_number = \
            Transaction.objects.filter(parentSchool=instance.parentSchool).filter(transactionDate__range=(transactionSession.startDate, transactionSession.endDate)) \
            .aggregate(Max('voucherNumber'))['voucherNumber__max']
        instance.voucherNumber = (last_voucher_number or 0) + 1
        ## Generating Voucher Number Ends ##


@receiver(post_save, sender=Transaction)
def transactionPostSave(sender, instance, **kwargs):
    if(kwargs['raw']):
        return
    if (kwargs['created'] and instance.approvalId):
        transactionSession = Session.objects.get(startDate__lte=instance.transactionDate, endDate__gte=instance.transactionDate)
        approval = Approval.objects.get(approvalId=instance.approvalId,
                                        parentEmployeeRequestedBy__parentSchool=instance.parentSchool,
                                        requestedGenerationDateTime__gte=transactionSession.startDate,
                                        requestedGenerationDateTime__lte=transactionSession.endDate)
        approval.parentTransaction = instance
        approval.transactionDate = instance.transactionDate
        approval.save()


class TransactionAccountDetails(models.Model):
    parentTransaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, related_name='transactionAccountDetailsList')
    parentAccount = models.ForeignKey(Accounts, on_delete=models.PROTECT, related_name='transactionAccountDetailsList')
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    CREDIT_TYPE = 'CREDIT'
    DEBIT_TYPE = 'DEBIT'
    ACCOUNT_TYPE = (
        (CREDIT_TYPE, 'CREDIT'),
        (DEBIT_TYPE, 'DEBIT'),
    )

    transactionType = models.TextField(choices=ACCOUNT_TYPE)

    class Permissions(BasePermission):
        RelationsToSchool = ['parentTransaction__parentSchool__id', 'parentTransaction__parentEmployee__parentSchool__id', 'parentAccount__parentSchool__id']

    class Meta:
        db_table = 'transaction_account_details'


class TransactionImages(models.Model):
    parentTransaction = models.ForeignKey(Transaction, on_delete=models.CASCADE)
    imageURL = models.ImageField(upload_to=upload_image_to)
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


class Approval(models.Model):   # what if both the employee are deleted, parentSchool should be there, or deleting should be handled
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE)
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT)
    parentEmployeeRequestedBy = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='ApprovalList')
    parentEmployeeApprovedBy = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='ApprovedList')
    approvalId = models.IntegerField(blank=True)
    parentTransaction = models.ForeignKey(Transaction, null=True, on_delete=models.CASCADE)
    requestedGenerationDateTime = models.DateField()
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

    requestStatus = models.TextField(choices=STATUS, default=PENDING_STATUS)  # why request status will be null

    class Meta:
        db_table = 'approval'
        unique_together = ('parentSchool', 'parentSession', 'approvalId')


@receiver(pre_save, sender=Approval)
def approvalPreSave(sender, instance, **kwargs):
    if(kwargs['raw']):
        return
    if instance.id is None:
        instance.approvalId = 1
        last_approval_id = \
            Approval.objects.filter(parentSchool=instance.parentSchool, parentSession=instance.parentSession) \
            .aggregate(Max('approvalId'))['approvalId__max']
        if last_approval_id is not None:
            instance.approvalId = last_approval_id + 1


class ApprovalAccountDetails(models.Model):  # should be connected to AccountSession

    parentApproval = models.ForeignKey(Approval, on_delete=models.CASCADE)
    parentAccount = models.ForeignKey(Accounts, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)

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
    imageURL = models.ImageField('approval_image', upload_to=upload_image_to_1,)

    BILL_TYPE = 'BILL'
    QUOTATION_TYPE = 'QUOTATION'
    DOCUMENT_TYPE = (
        (BILL_TYPE, 'BILL'),
        (QUOTATION_TYPE, 'QUOTATION'),
    )

    imageType = models.TextField(choices=DOCUMENT_TYPE)
    orderNumber = models.IntegerField(default=0, verbose_name='orderNumber')

    class Meta:
        db_table = 'approval_images'


class LockAccounts(models.Model):

    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE)
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT)

    class Meta:
        db_table = 'lock_accounts'
        unique_together = ('parentSchool', 'parentSession')
