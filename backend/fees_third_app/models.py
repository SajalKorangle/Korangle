from employee_app.models import EmployeePermission
from payment_app.cashfree.cashfree import initiateRefund
from payment_app.models import SchoolMerchantAccount
from django.db import models

from school_app.model.models import School, Session, BusStop

from class_app.models import Class, Division

from student_app.models import Student, StudentParameter

from employee_app.models import Employee

from accounts_app.models import Transaction, AccountSession
from payment_app.models import Order

from datetime import datetime
from accounts_app.models import Transaction, AccountSession

from django.dispatch import receiver
from django.db.models.signals import post_save, pre_save
from django.db.models import Max
import json

from django.db import transaction as db_transaction

from .business.constant import INSTALLMENT_LIST
from common.common import BasePermission
from generic.generic_serializer_interface import GenericSerializerInterface


class FeeType(models.Model):

    name = models.TextField(verbose_name='name')
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0, verbose_name='parentSchool')
    orderNumber = models.BigIntegerField(verbose_name='orderNumber', default=0)

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']

    class Meta:
        db_table = 'fee_type_new'
        unique_together = ('name', 'parentSchool')


class SchoolFeeRule(models.Model):

    name = models.TextField(verbose_name='name')
    ruleNumber = models.IntegerField(verbose_name='ruleNumber', default=0)

    isClassFilter = models.BooleanField(verbose_name='isClassFilter', default=False)
    isBusStopFilter = models.BooleanField(verbose_name='isBusStopFilter', default=False)
    onlyNewAdmission = models.BooleanField(verbose_name='onlyNewAdmission', default=False)
    includeRTE = models.BooleanField(verbose_name='includeRTE', default=True)

    parentFeeType = models.ForeignKey(FeeType, on_delete=models.PROTECT, default=0, verbose_name='parentFeeType')
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, default=0, verbose_name='parentSession')
    isAnnually = models.BooleanField(verbose_name='isAnnually', default=False)

    # April
    aprilAmount = models.IntegerField(null=True, verbose_name='aprilAmount')
    aprilLastDate = models.DateField(null=True, verbose_name='aprilLastDate')
    aprilLateFee = models.IntegerField(null=True, verbose_name='aprilLateFee')
    aprilMaximumLateFee = models.IntegerField(null=True, verbose_name='aprilMaximumLateFee')

    # May
    mayAmount = models.IntegerField(null=True, verbose_name='mayAmount')
    mayLastDate = models.DateField(null=True, verbose_name='mayLastDate')
    mayLateFee = models.IntegerField(null=True, verbose_name='mayLateFee')
    mayMaximumLateFee = models.IntegerField(null=True, verbose_name='mayMaximumLateFee')

    # June
    juneAmount = models.IntegerField(null=True, verbose_name='juneAmount')
    juneLastDate = models.DateField(null=True, verbose_name='juneLastDate')
    juneLateFee = models.IntegerField(null=True, verbose_name='juneLateFee')
    juneMaximumLateFee = models.IntegerField(null=True, verbose_name='juneMaximumLateFee')

    # July
    julyAmount = models.IntegerField(null=True, verbose_name='julyAmount')
    julyLastDate = models.DateField(null=True, verbose_name='julyLastDate')
    julyLateFee = models.IntegerField(null=True, verbose_name='julyLateFee')
    julyMaximumLateFee = models.IntegerField(null=True, verbose_name='julyMaximumLateFee')

    # August
    augustAmount = models.IntegerField(null=True, verbose_name='augustAmount')
    augustLastDate = models.DateField(null=True, verbose_name='augustLastDate')
    augustLateFee = models.IntegerField(null=True, verbose_name='augustLateFee')
    augustMaximumLateFee = models.IntegerField(null=True, verbose_name='augustMaximumLateFee')

    # September
    septemberAmount = models.IntegerField(null=True, verbose_name='septemberAmount')
    septemberLastDate = models.DateField(null=True, verbose_name='septemberLastDate')
    septemberLateFee = models.IntegerField(null=True, verbose_name='septemberLateFee')
    septemberMaximumLateFee = models.IntegerField(null=True, verbose_name='septemberMaximumLateFee')

    # October
    octoberAmount = models.IntegerField(null=True, verbose_name='octoberAmount')
    octoberLastDate = models.DateField(null=True, verbose_name='octoberLastDate')
    octoberLateFee = models.IntegerField(null=True, verbose_name='octoberLateFee')
    octoberMaximumLateFee = models.IntegerField(null=True, verbose_name='octoberMaximumLateFee')

    # November
    novemberAmount = models.IntegerField(null=True, verbose_name='novemberAmount')
    novemberLastDate = models.DateField(null=True, verbose_name='novemberLastDate')
    novemberLateFee = models.IntegerField(null=True, verbose_name='novemberLateFee')
    novemberMaximumLateFee = models.IntegerField(null=True, verbose_name='novemberMaximumLateFee')

    # December
    decemberAmount = models.IntegerField(null=True, verbose_name='decemberAmount')
    decemberLastDate = models.DateField(null=True, verbose_name='decemberLastDate')
    decemberLateFee = models.IntegerField(null=True, verbose_name='decemberLateFee')
    decemberMaximumLateFee = models.IntegerField(null=True, verbose_name='decemberMaximumLateFee')

    # January
    januaryAmount = models.IntegerField(null=True, verbose_name='januaryAmount')
    januaryLastDate = models.DateField(null=True, verbose_name='januaryLastDate')
    januaryLateFee = models.IntegerField(null=True, verbose_name='januaryLateFee')
    januaryMaximumLateFee = models.IntegerField(null=True, verbose_name='januaryMaximumLateFee')

    # February
    februaryAmount = models.IntegerField(null=True, verbose_name='februaryAmount')
    februaryLastDate = models.DateField(null=True, verbose_name='februaryLastDate')
    februaryLateFee = models.IntegerField(null=True, verbose_name='februaryLateFee')
    februaryMaximumLateFee = models.IntegerField(null=True, verbose_name='februaryMaximumLateFee')

    # March
    marchAmount = models.IntegerField(null=True, verbose_name='marchAmount')
    marchLastDate = models.DateField(null=True, verbose_name='marchLastDate')
    marchLateFee = models.IntegerField(null=True, verbose_name='marchLateFee')
    marchMaximumLateFee = models.IntegerField(null=True, verbose_name='marchMaximumLateFee')

    class Permissions(BasePermission):
        RelationsToSchool = ['parentFeeType__parentSchool__id']

    class Meta:
        db_table = 'school_fee_rule'
        unique_together = [('ruleNumber', 'parentFeeType', 'parentSession'), ('name', 'parentFeeType', 'parentSession')]


class ClassFilterFee(models.Model):

    parentSchoolFeeRule = models.ForeignKey(SchoolFeeRule, on_delete=models.CASCADE, default=0, verbose_name='parentSchoolFeeRule')
    parentClass = models.ForeignKey(Class, on_delete=models.PROTECT, default=0, verbose_name='parentClass')
    parentDivision = models.ForeignKey(Division, on_delete=models.PROTECT, default=0, verbose_name='parentDivision')

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchoolFeeRule__parentFeeType__parentSchool__id']

    class Meta:
        db_table = 'class_filter_fee'


class ViewDefaulterPermissions(models.Model):
    USER_TYPE = (
        ('Admin', 'Admin'),
        ('Teacher', 'Teacher')
    )

    parentEmployeePermission = models.ForeignKey(EmployeePermission, on_delete=models.CASCADE, verbose_name='parentEmployeePermission', unique=True)
    userType = models.CharField(max_length=10, choices=USER_TYPE, default='Admin')
    viewSummary = models.BooleanField(null=False, default=True)
    viewStudent = models.BooleanField(null=False, default=True)

    class Permissions(BasePermission):
        RelationsToSchool = ['parentEmployeePermission__parentEmployee__parentSchool__id']

    class Meta:
        db_table = 'view_defaulter_permissions'


class BusStopFilterFee(models.Model):

    parentSchoolFeeRule = models.ForeignKey(SchoolFeeRule, on_delete=models.CASCADE, default=0, verbose_name='parentSchoolFeeRule')
    parentBusStop = models.ForeignKey(BusStop, on_delete=models.CASCADE, default=0, verbose_name='parentBusStop')

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchoolFeeRule__parentFeeType__parentSchool__id']

    class Meta:
        db_table = 'bus_stop_filter_fee'


class CustomFilterFee(models.Model):
    parentSchoolFeeRule = models.ForeignKey(SchoolFeeRule, on_delete=models.CASCADE, default=0, verbose_name='parentSchoolFeeRule')
    parentStudentParameter = models.ForeignKey(StudentParameter, on_delete=models.CASCADE, default=0, verbose_name='parentStudentParameter')
    selectedFilterValues = models.TextField(null=True, blank=True)

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchoolFeeRule__parentFeeType__parentSchool__id']

    class Meta:
        db_table = 'custom_filter_fee'
        

class StudentFee(models.Model):

    parentStudent = models.ForeignKey(Student, on_delete=models.CASCADE, default=0, verbose_name='parentStudent')
    parentSchoolFeeRule = models.ForeignKey(SchoolFeeRule, on_delete=models.CASCADE, default=0, verbose_name='parentSchoolFeeRule')

    parentFeeType = models.ForeignKey(FeeType, on_delete=models.PROTECT, default=0, verbose_name='parentFeeType')
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, default=0, verbose_name='parentSession')
    isAnnually = models.BooleanField(verbose_name='isAnnually', default=False)

    cleared = models.BooleanField(verbose_name='cleared', default=False)

    # April
    aprilAmount = models.IntegerField(null=True, verbose_name='aprilAmount')
    aprilLastDate = models.DateField(null=True, verbose_name='aprilLastDate')
    aprilLateFee = models.IntegerField(null=True, verbose_name='aprilLateFee')
    aprilMaximumLateFee = models.IntegerField(null=True, verbose_name='aprilMaximumLateFee')
    aprilClearanceDate = models.DateField(null=True, verbose_name='aprilClearanceDate')

    # May
    mayAmount = models.IntegerField(null=True, verbose_name='mayAmount')
    mayLastDate = models.DateField(null=True, verbose_name='mayLastDate')
    mayLateFee = models.IntegerField(null=True, verbose_name='mayLateFee')
    mayMaximumLateFee = models.IntegerField(null=True, verbose_name='mayMaximumLateFee')
    mayClearanceDate = models.DateField(null=True, verbose_name='mayClearanceDate')

    # June
    juneAmount = models.IntegerField(null=True, verbose_name='juneAmount')
    juneLastDate = models.DateField(null=True, verbose_name='juneLastDate')
    juneLateFee = models.IntegerField(null=True, verbose_name='juneLateFee')
    juneMaximumLateFee = models.IntegerField(null=True, verbose_name='juneMaximumLateFee')
    juneClearanceDate = models.DateField(null=True, verbose_name='juneClearanceDate')

    # July
    julyAmount = models.IntegerField(null=True, verbose_name='julyAmount')
    julyLastDate = models.DateField(null=True, verbose_name='julyLastDate')
    julyLateFee = models.IntegerField(null=True, verbose_name='julyLateFee')
    julyMaximumLateFee = models.IntegerField(null=True, verbose_name='julyMaximumLateFee')
    julyClearanceDate = models.DateField(null=True, verbose_name='julyClearanceDate')

    # August
    augustAmount = models.IntegerField(null=True, verbose_name='augustAmount')
    augustLastDate = models.DateField(null=True, verbose_name='augustLastDate')
    augustLateFee = models.IntegerField(null=True, verbose_name='augustLateFee')
    augustMaximumLateFee = models.IntegerField(null=True, verbose_name='augustMaximumLateFee')
    augustClearanceDate = models.DateField(null=True, verbose_name='augustClearanceDate')

    # September
    septemberAmount = models.IntegerField(null=True, verbose_name='septemberAmount')
    septemberLastDate = models.DateField(null=True, verbose_name='septemberLastDate')
    septemberLateFee = models.IntegerField(null=True, verbose_name='septemberLateFee')
    septemberMaximumLateFee = models.IntegerField(null=True, verbose_name='septemberMaximumLateFee')
    septemberClearanceDate = models.DateField(null=True, verbose_name='septemberClearanceDate')

    # October
    octoberAmount = models.IntegerField(null=True, verbose_name='octoberAmount')
    octoberLastDate = models.DateField(null=True, verbose_name='octoberLastDate')
    octoberLateFee = models.IntegerField(null=True, verbose_name='octoberLateFee')
    octoberMaximumLateFee = models.IntegerField(null=True, verbose_name='octoberMaximumLateFee')
    octoberClearanceDate = models.DateField(null=True, verbose_name='octoberClearanceDate')

    # November
    novemberAmount = models.IntegerField(null=True, verbose_name='novemberAmount')
    novemberLastDate = models.DateField(null=True, verbose_name='novemberLastDate')
    novemberLateFee = models.IntegerField(null=True, verbose_name='novemberLateFee')
    novemberMaximumLateFee = models.IntegerField(null=True, verbose_name='novemberMaximumLateFee')
    novemberClearanceDate = models.DateField(null=True, verbose_name='novemberClearanceDate')

    # December
    decemberAmount = models.IntegerField(null=True, verbose_name='decemberAmount')
    decemberLastDate = models.DateField(null=True, verbose_name='decemberLastDate')
    decemberLateFee = models.IntegerField(null=True, verbose_name='decemberLateFee')
    decemberMaximumLateFee = models.IntegerField(null=True, verbose_name='decemberMaximumLateFee')
    decemberClearanceDate = models.DateField(null=True, verbose_name='decemberClearanceDate')

    # January
    januaryAmount = models.IntegerField(null=True, verbose_name='januaryAmount')
    januaryLastDate = models.DateField(null=True, verbose_name='januaryLastDate')
    januaryLateFee = models.IntegerField(null=True, verbose_name='januaryLateFee')
    januaryMaximumLateFee = models.IntegerField(null=True, verbose_name='januaryMaximumLateFee')
    januaryClearanceDate = models.DateField(null=True, verbose_name='januaryClearanceDate')

    # February
    februaryAmount = models.IntegerField(null=True, verbose_name='februaryAmount')
    februaryLastDate = models.DateField(null=True, verbose_name='februaryLastDate')
    februaryLateFee = models.IntegerField(null=True, verbose_name='februaryLateFee')
    februaryMaximumLateFee = models.IntegerField(null=True, verbose_name='februaryMaximumLateFee')
    februaryClearanceDate = models.DateField(null=True, verbose_name='februaryClearanceDate')

    # March
    marchAmount = models.IntegerField(null=True, verbose_name='marchAmount')
    marchLastDate = models.DateField(null=True, verbose_name='marchLastDate')
    marchLateFee = models.IntegerField(null=True, verbose_name='marchLateFee')
    marchMaximumLateFee = models.IntegerField(null=True, verbose_name='marchMaximumLateFee')
    marchClearanceDate = models.DateField(null=True, verbose_name='marchClearanceDate')

    class Permissions(BasePermission):
        RelationsToSchool = ['parentFeeType__parentSchool__id', 'parentStudent__parentSchool__id', 'parentSchoolFeeRule__parentFeeType__parentSchool__id']
        RelationsToStudent = ['parentStudent__id']

    class Meta:
        db_table = 'student_fee'
        unique_together = ('parentSchoolFeeRule', 'parentStudent')


class FeeReceiptBook(models.Model):

    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE, default=0, related_name='feeReceiptBookList')
    name = models.TextField()
    receiptNumberPrefix = models.TextField(blank=True, default='')
    active = models.BooleanField(default=True) # whether to use in collect fees while generating receipt

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']
        RelationsToStudent = []

    class Meta:
        db_table = 'fee_receipt_book'
        unique_together=('parentSchool', 'name')

class FeeReceipt(models.Model):

    parentFeeReceiptBook = models.ForeignKey(FeeReceiptBook, on_delete=models.CASCADE, null=True, related_name='feeReceiptList')

    # Blank=True is needed because now this field is not coming from frontend and is not present in the data during save.
    # Receipt number is calculated in the signal.
    receiptNumber = models.IntegerField(blank=True, default=0)
    generationDateTime = models.DateTimeField(null=False, auto_now_add=True)
    remark = models.TextField(null=True)
    cancelled = models.BooleanField(null=False, default=False)

    # Added for the unique together field,
    # Also required in case fee receipt is cancelled, student is deleted, and we need to calculate the maximum receipt number
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0, related_name='feeReceiptList')

    parentStudent = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, related_name='feeReceiptList')
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=False, default=0, related_name='feeReceiptList')
    parentEmployee = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='feeReceiptList')

    chequeNumber = models.BigIntegerField(null=True, verbose_name='chequeNumber')

    cancelledDateTime = models.DateTimeField(null=True, verbose_name='cancelledDateTime')
    cancelledRemark = models.TextField(null=True, verbose_name='cancelledRemark')
    cancelledBy = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='cancelledFeeReceiptList')

    MODE_OF_PAYMENT = (
        ('Cash', 'Cash'),
        ('Cheque', 'Cheque'),
        ('Online', 'Online'),
        ('KORANGLE', 'KORANGLE'),
    )
    modeOfPayment = models.CharField(max_length=20, choices=MODE_OF_PAYMENT, null=True)
    parentTransaction = models.ForeignKey(Transaction, null=True, on_delete=models.SET_NULL, related_name='feeReceiptList')

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id', 'parentFeeReceiptBook__parentSchool__id', 'parentStudent__parentSchool__id', 'parentEmployee__parentSchool__id']
        RelationsToStudent = ['parentStudent__id']

    class Meta:
        db_table = 'fee_receipt_new'
        unique_together = ('receiptNumber', 'parentFeeReceiptBook')

    # Transaction atomic ensures that two parallel saves is not happening which can lead to same receipt number
    # which is calculated in the pre save signal.
    @db_transaction.atomic
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)


@receiver(pre_save, sender=FeeReceipt)
def FeeReceiptPreSave(sender, instance, **kwargs):
    if(kwargs['raw']):
        return
    if not instance.id:  # before Fee Receipt creation

        ## Getting Receipt Number Starts ##
        last_receipt_number = FeeReceipt.objects.filter(parentFeeReceiptBook=instance.parentFeeReceiptBook)\
            .aggregate(Max('receiptNumber'))['receiptNumber__max']
        instance.receiptNumber = (last_receipt_number or 0) + 1
        ## Getting Receipt Number Ends ##

    # Getting original instance as will be used at many places.
    if instance.id:
        originalInstance = FeeReceipt.objects.get(id=instance.id)

        ## Handling Fee Receipt Cancellation Starts ##
        if instance.cancelled and not originalInstance.cancelled:

            ## Deleting Transaction Starts ##
            if originalInstance.parentTransaction:
                originalInstance.parentTransaction.delete()
                instance.parentTransaction = None
            ## Deleting Transaction Ends ##

        ## Handling Fee Receipt Cancellation Ends ##


@receiver(post_save, sender=FeeReceipt)
def FeeReceiptPostSave(sender, instance: FeeReceipt, **kwargs):
    subFeeReceiptList = instance.subFeeReceiptList.all()
    for subFeeReceipt in subFeeReceiptList:
        receiptValidateAndUpdate(subFeeReceipt.parentStudentFee)

class SubFeeReceipt(models.Model):

    parentFeeReceipt = models.ForeignKey(FeeReceipt, on_delete=models.PROTECT, default=0, related_name='subFeeReceiptList')
    parentStudentFee = models.ForeignKey(StudentFee, on_delete=models.SET_NULL, null=True, related_name='subFeeReceiptList')
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=False, default=0, related_name='subFeeReceiptList')
    parentFeeType = models.ForeignKey(FeeType, on_delete=models.PROTECT, default=0, related_name='subFeeReceiptList')
    isAnnually = models.BooleanField(verbose_name='isAnnually', default=False)

    # April
    aprilAmount = models.IntegerField(null=True, verbose_name='aprilAmount')
    aprilLateFee = models.IntegerField(null=True, verbose_name='aprilLateFee')

    # May
    mayAmount = models.IntegerField(null=True, verbose_name='mayAmount')
    mayLateFee = models.IntegerField(null=True, verbose_name='mayLateFee')

    # June
    juneAmount = models.IntegerField(null=True, verbose_name='juneAmount')
    juneLateFee = models.IntegerField(null=True, verbose_name='juneLateFee')

    # July
    julyAmount = models.IntegerField(null=True, verbose_name='julyAmount')
    julyLateFee = models.IntegerField(null=True, verbose_name='julyLateFee')

    # August
    augustAmount = models.IntegerField(null=True, verbose_name='augustAmount')
    augustLateFee = models.IntegerField(null=True, verbose_name='augustLateFee')

    # September
    septemberAmount = models.IntegerField(null=True, verbose_name='septemberAmount')
    septemberLateFee = models.IntegerField(null=True, verbose_name='septemberLateFee')

    # October
    octoberAmount = models.IntegerField(null=True, verbose_name='octoberAmount')
    octoberLateFee = models.IntegerField(null=True, verbose_name='octoberLateFee')

    # November
    novemberAmount = models.IntegerField(null=True, verbose_name='novemberAmount')
    novemberLateFee = models.IntegerField(null=True, verbose_name='novemberLateFee')

    # December
    decemberAmount = models.IntegerField(null=True, verbose_name='decemberAmount')
    decemberLateFee = models.IntegerField(null=True, verbose_name='decemberLateFee')

    # January
    januaryAmount = models.IntegerField(null=True, verbose_name='januaryAmount')
    januaryLateFee = models.IntegerField(null=True, verbose_name='januaryLateFee')

    # February
    februaryAmount = models.IntegerField(null=True, verbose_name='februaryAmount')
    februaryLateFee = models.IntegerField(null=True, verbose_name='februaryLateFee')

    # March
    marchAmount = models.IntegerField(null=True, verbose_name='marchAmount')
    marchLateFee = models.IntegerField(null=True, verbose_name='marchLateFee')

    class Permissions(BasePermission):
        RelationsToSchool = ['parentFeeReceipt__parentSchool__id', 'parentStudentFee__parentStudent__parentSchool__id', 'parentFeeType__parentSchool__id']
        RelationsToStudent = ['parentStudentFee__parentStudent__id', 'parentFeeReceipt__parentStudent__id']

    @db_transaction.atomic
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    class Meta:
        db_table = 'sub_fee_receipt__new'


@receiver(pre_save, sender=SubFeeReceipt)
def subFeeReceiptDataCheck(sender, instance: SubFeeReceipt, **kwargs):
    receiptValidateAndUpdate(instance.parentStudentFee, instance)


class Discount(models.Model):

    discountNumber = models.IntegerField(default=0, verbose_name='discountNumber')
    generationDateTime = models.DateTimeField(auto_now_add=True, verbose_name='generationDateTime')
    remark = models.TextField(null=True, verbose_name='remark')
    cancelled = models.BooleanField(default=False, verbose_name='cancelled')
    parentStudent = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, related_name='discountList')

    # Added for the unique together field,
    # Also required in case discount is cancelled, student is deleted, and we need to calculate the maximum discount number
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0, related_name='discountList')

    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, default=0, related_name='discountList')
    parentEmployee = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='discountList')

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id', 'parentEmployee__parentSchool__id', 'parentStudent__parentSchool__id']
        RelationsToStudent = ['parentStudent__id']

    class Meta:
        db_table = 'discount_new'
        unique_together = ('discountNumber', 'parentSchool')


@receiver(pre_save, sender=Discount)
def discountPreSave(sender, instance: Discount, **kwargs):
    if(kwargs['raw']):
        return
    if instance.id is None:
        ## Getting Discount Number Starts ##
        last_discount_number = Discount.objects.filter(parentSchool=instance.parentSchool)\
            .aggregate(Max('discountNumber'))['discountNumber__max']
        instance.discountNumber = (last_discount_number or 0) + 1
        ## Getting Discount Number Ends ##


@receiver(post_save, sender=Discount)
def discountPostSave(sender, instance: Discount, **kwargs):
    if(kwargs['raw']):
        return
    subDiscountList = instance.subDiscountList.all()
    for subDiscount in subDiscountList:
        receiptValidateAndUpdate(subDiscount.parentStudentFee)


class SubDiscount(models.Model):

    parentDiscount = models.ForeignKey(Discount, on_delete=models.PROTECT, default=0, related_name='subDiscountList')
    parentStudentFee = models.ForeignKey(StudentFee, on_delete=models.SET_NULL, null=True, related_name='subDiscountList')
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=False, default=0, related_name='subDiscountList')
    parentFeeType = models.ForeignKey(FeeType, on_delete=models.PROTECT, default=0, related_name='subDiscountList')
    isAnnually = models.BooleanField(verbose_name='isAnnually', default=False)

    # April
    aprilAmount = models.IntegerField(null=True, verbose_name='aprilAmount')
    aprilLateFee = models.IntegerField(null=True, verbose_name='aprilLateFee')

    # May
    mayAmount = models.IntegerField(null=True, verbose_name='mayAmount')
    mayLateFee = models.IntegerField(null=True, verbose_name='mayLateFee')

    # June
    juneAmount = models.IntegerField(null=True, verbose_name='juneAmount')
    juneLateFee = models.IntegerField(null=True, verbose_name='juneLateFee')

    # July
    julyAmount = models.IntegerField(null=True, verbose_name='julyAmount')
    julyLateFee = models.IntegerField(null=True, verbose_name='julyLateFee')

    # August
    augustAmount = models.IntegerField(null=True, verbose_name='augustAmount')
    augustLateFee = models.IntegerField(null=True, verbose_name='augustLateFee')

    # September
    septemberAmount = models.IntegerField(null=True, verbose_name='septemberAmount')
    septemberLateFee = models.IntegerField(null=True, verbose_name='septemberLateFee')

    # October
    octoberAmount = models.IntegerField(null=True, verbose_name='octoberAmount')
    octoberLateFee = models.IntegerField(null=True, verbose_name='octoberLateFee')

    # November
    novemberAmount = models.IntegerField(null=True, verbose_name='novemberAmount')
    novemberLateFee = models.IntegerField(null=True, verbose_name='novemberLateFee')

    # December
    decemberAmount = models.IntegerField(null=True, verbose_name='decemberAmount')
    decemberLateFee = models.IntegerField(null=True, verbose_name='decemberLateFee')

    # January
    januaryAmount = models.IntegerField(null=True, verbose_name='januaryAmount')
    januaryLateFee = models.IntegerField(null=True, verbose_name='januaryLateFee')

    # February
    februaryAmount = models.IntegerField(null=True, verbose_name='februaryAmount')
    februaryLateFee = models.IntegerField(null=True, verbose_name='februaryLateFee')

    # March
    marchAmount = models.IntegerField(null=True, verbose_name='marchAmount')
    marchLateFee = models.IntegerField(null=True, verbose_name='marchLateFee')

    class Permissions(BasePermission):
        RelationsToSchool = ['parentDiscount__parentSchool__id', 'parentStudentFee__parentStudent__parentSchool__id', 'parentFeeType__parentSchool__id']
        RelationsToStudent = ['parentDiscount__parentStudent__id', 'parentStudentFee__parentStudent__id']

    class Meta:
        db_table = 'sub_discount_new'


@receiver(post_save, sender=SubDiscount)
def subDiscountPostSave(sender, instance: SubDiscount, **kwargs):
    if(kwargs['raw']):
        return
    receiptValidateAndUpdate(instance.parentStudentFee)


def receiptValidateAndUpdate(studentFee, newSubFeeReceipt=SubFeeReceipt()):
    ## Initialization Starts ##
    subFeeReceiptList = studentFee.subFeeReceiptList.filter(parentFeeReceipt__cancelled=False)
    subDiscountList = SubDiscount.objects.filter(parentDiscount__cancelled=False, parentStudentFee=studentFee)

    isClearedMappedByMonth = {}  # To store month wise clearance
    for month in INSTALLMENT_LIST:
        isClearedMappedByMonth[month] = False  # Initialize all months as False

    ## Initialization Ends ##

    ## Monthwise Validity Check For New SubFeeReceipt and Student Fee Updation Starts##
    for month in INSTALLMENT_LIST:
        paidAmount = 0

        paidAmount += getattr(newSubFeeReceipt, month + 'Amount') or 0  # Add the amount of to be created SubFeeReceipt

        for subFeeReceipt in subFeeReceiptList:
            paidAmount += getattr(subFeeReceipt, month + 'Amount') or 0  # Add the amount of to be saved SubFeeReceipt

        studentFeeAmount = getattr(studentFee, month + 'Amount') or 0  # Get the amount of studentFee
        for subDiscount in subDiscountList:
            studentFeeAmount -= getattr(subDiscount, month + 'Amount') or 0  # Subtract the discounted amount

        assert paidAmount <= studentFeeAmount, 'Total Paid Amount is exceeding actual Student Fee Amount'
        if paidAmount == studentFeeAmount:
            isClearedMappedByMonth[month] = True

        ## Validations Starts ##

        # if(getattr(studentFee, month + 'ClearanceDate')):  # month already cleared
            ## Relaxed # assert not getattr(newSubFeeReceipt, month + 'LateFee'), "incoming late fee after month fee is cleared"
            ## Not Required, handeled earlier while check total paid amount and actual amount # assert not getattr(newSubFeeReceipt, month + 'Amount'), "incoming amount after month fee is cleared"

        if getattr(studentFee, month + 'Amount') and getattr(studentFee, month + 'LastDate')\
                and getattr(studentFee, month + 'LateFee'):  # late fee
            deltaDays = ((getattr(studentFee, month + 'ClearanceDate') or datetime.now().date()) - getattr(studentFee, month + 'LastDate')).days
            deltaDays = max(deltaDays, 0)
            lateFee = deltaDays * getattr(studentFee, month + 'LateFee')
            if(getattr(studentFee, month + 'MaximumLateFee')):
                lateFee = min(lateFee, getattr(studentFee, month + 'MaximumLateFee'))

            for subDiscount in subDiscountList:
                lateFee -= getattr(subDiscount, month + 'LateFee') or 0

            totalPaidLateFee = 0
            for subFeeReceipt in subFeeReceiptList:
                totalPaidLateFee += getattr(subFeeReceipt, month + 'LateFee') or 0

            totalPaidLateFee += getattr(newSubFeeReceipt, month + 'LateFee') or 0

            assert totalPaidLateFee <= lateFee, "total paid late fee is exceeding actual late fee"

            if totalPaidLateFee < lateFee:
                assert (getattr(newSubFeeReceipt, month + 'Amount') or 0) == 0, "incoming fee amount without clearing late fee"

    ## Cleared and Cleared Date Handling for Student Fee ##
    cleared = True
    for month in INSTALLMENT_LIST:
        cleared = cleared and isClearedMappedByMonth[month]
        if isClearedMappedByMonth[month] and getattr(studentFee, month + 'Amount') is not None:
            setattr(studentFee, month + 'ClearanceDate', getattr(studentFee, month + 'ClearanceDate') or datetime.now())
        else:
            setattr(studentFee, month + 'ClearanceDate', None)
    if(cleared):
        studentFee.cleared = True
    studentFee.save()


class FeeSchoolSessionSettings(models.Model):
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE)
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT)
    sessionLocked = models.BooleanField(default=False)
    accountingSettingsJSON = models.TextField(null=True)  # json data

    class Meta:
        unique_together = ('parentSchool', 'parentSession')


class FeeSchoolSettings(models.Model):
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE, unique = True)
    printSingleReceipt = models.BooleanField(default=False)

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']


class FeeReceiptOrder(models.Model):
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, related_name='feeReceiptOrderList')
    parentStudent = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, related_name='feeReceiptOrderList')
    parentOrder = models.ForeignKey(Order, on_delete=models.PROTECT, related_name='feeReceiptOrderList')
    feeReceiptData = models.JSONField()
    parentFeeReceipt = models.ForeignKey(FeeReceipt, on_delete=models.PROTECT, null=True, blank=True, related_name='feeReceiptOrderList')

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id', 'parentFeeReceipt__parentSchool__id']
        RelationsToStudent = ['parentStudent__id', 'parentFeeReceipt__parentStudent__id']


@receiver(pre_save, sender=Order)
def FeeReceiptOrderCompletionHandler(sender, instance, **kwargs):
    if (not instance._state.adding) and instance.status == 'Completed':
        preSavedOrder = Order.objects.get(orderId=instance.orderId)
        if preSavedOrder.status == 'Pending':  # if status changed from 'Pending' to 'Completed'

            feeReceiptOrderList = FeeReceiptOrder.objects.filter(parentOrder=preSavedOrder)
            if len(feeReceiptOrderList) == 0:  # No Linked FeeReceiptOrder, Order is made for some other purpose
                return

            activeSchoolId = feeReceiptOrderList[0].parentSchool.id

            currentSession = Session.objects.get(startDate__lte=datetime.now(), endDate__gte=datetime.now())
            debitAccount = None
            creditAccount = None
            try:
                feeSettings = FeeSchoolSessionSettings.objects.get(parentSchool=activeSchoolId, parentSession=currentSession)
                if(feeSettings.accountingSettingsJSON):
                    accountingSettings = json.loads(feeSettings.accountingSettingsJSON)
                    debitAccount = AccountSession.objects.get(id=accountingSettings['parentAccountFrom']).parentAccount
                    creditAccount = AccountSession.objects.get(id=accountingSettings['parentOnlinePaymentCreditAccount']).parentAccount
            except:
                pass

            with db_transaction.atomic():
                for feeReceiptOrder in feeReceiptOrderList:
                    activeStudentId = feeReceiptOrder.parentStudent.id

                    feeReceiptData = feeReceiptOrder.feeReceiptData
                    feeReceiptData.update({
                        'remark': 'Reference id: {0}'.format(instance.referenceId),
                        'modeOfPayment': 'KORANGLE',
                    })

                    if debitAccount and creditAccount:
                        feeReceiptSession = Session.objects.get(id=feeReceiptData['parentSession'])

                        from functools import reduce
                        transactionAmount = reduce(
                            lambda total, subFeeReceipt: total + reduce(lambda installmentTotal, installment: installmentTotal + (
                                subFeeReceipt[installment + 'Amount'] or 0) + (subFeeReceipt[installment + 'LateFee'] or 0), INSTALLMENT_LIST, 0),
                            feeReceiptData['subFeeReceiptList'], 0)

                        transactionData = {
                            'parentEmployee': None,
                            'parentSchool': activeSchoolId,
                            'remark': 'Student Fee Payment for {0} with Scholar No. {1} of {2}'.format(feeReceiptOrder.parentStudent.name, feeReceiptOrder.parentStudent.scholarNumber, feeReceiptOrder.parentStudent.get_class_object(feeReceiptSession).name),
                            'transactionDate': datetime.now().strftime('%Y-%m-%d'),
                            'feeReceiptList': [feeReceiptData],
                            'transactionAccountDetailsList': [
                                {
                                    'parentAccount': debitAccount.id,
                                    'amount': transactionAmount,
                                    'transactionType': 'CREDIT'
                                },
                                {
                                    'parentAccount': creditAccount.id,
                                    'amount': transactionAmount,
                                    'transactionType': 'DEBIT'
                                }
                            ]
                        }
                        transactionRespone = GenericSerializerInterface(Model=Transaction, data=transactionData,
                                                                        activeSchoolId=activeSchoolId, activeStudentIdList=[activeStudentId]).create_object()
                        feeReceiptResponse = transactionRespone['feeReceiptList'][0]
                    else:
                        feeReceiptResponse = GenericSerializerInterface(Model=FeeReceipt, data=feeReceiptData,
                                                                        activeSchoolId=activeSchoolId, activeStudentIdList=[activeStudentId]).create_object()

                    newFeeReceipt = FeeReceipt.objects.get(id=feeReceiptResponse['id'])
                    feeReceiptOrder.parentFeeReceipt = newFeeReceipt
                    feeReceiptOrder.save()

    pass


from payment_app.cashfree.cashfree import getOrderPaymetSplitDetails

# For handling refund in case an order fails
@receiver(pre_save, sender=Order)
def FeeAmountRefundHandler(sender, instance, **kwargs):
    if (not instance._state.adding) and instance.status == 'Refund Pending':
        preSavedOrder = Order.objects.get(orderId=instance.orderId)

        if preSavedOrder.status == 'Pending':  # if status changed from 'Pending' to 'Refund Pending'

            onlinePaymentTransactionList = FeeReceiptOrder.objects.filter(parentOrder=preSavedOrder)
            if len(onlinePaymentTransactionList) == 0:  # No attached OnlineFeePaymentTransaction row, Order is made for some other purpose
                return

            orderSplitDetails = getOrderPaymetSplitDetails(instance.orderId)
            refundAmount = orderSplitDetails["orderSplit"][0]["amount"]

            splitDetails = [
                {
                    "merchantVendorId": orderSplitDetails["orderSplit"][0]["vendorId"],
                    "amount": float(refundAmount),
                }
            ]

            response = initiateRefund(instance.orderId, splitDetails, refundAmount)
            instance.refundId = response['refundId']
            instance.status = 'Refund Initiated'
