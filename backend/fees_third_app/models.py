from payment_app.cashfree.cashfree import initiateRefund
from payment_app.models import SchoolMerchantAccount
from accounts_app.views import TransactionAccountDetailsView
from django.db import models

from school_app.model.models import School, Session, BusStop

from class_app.models import Class, Division

from student_app.models import Student

from employee_app.models import Employee

from accounts_app.models import Transaction, AccountSession
from payment_app.models import Order

from datetime import datetime
from accounts_app.models import Transaction, AccountSession

from django.dispatch import receiver
from django.db.models.signals import post_save, pre_save
from django.db.models import Max
import json

from common.common_serializer_interface_3 import create_object, create_list

from django.db import transaction as db_transaction

from .business.constant import INSTALLMENT_LIST


class FeeType(models.Model):

    name = models.TextField(verbose_name='name')
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0, verbose_name='parentSchool')
    orderNumber = models.BigIntegerField(verbose_name='orderNumber', default=0)

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

    class Meta:
        db_table = 'school_fee_rule'
        unique_together = [('ruleNumber', 'parentFeeType', 'parentSession'), ('name', 'parentFeeType', 'parentSession')]


class ClassFilterFee(models.Model):

    parentSchoolFeeRule = models.ForeignKey(SchoolFeeRule, on_delete=models.CASCADE, default=0, verbose_name='parentSchoolFeeRule')
    parentClass = models.ForeignKey(Class, on_delete=models.PROTECT, default=0, verbose_name='parentClass')
    parentDivision = models.ForeignKey(Division, on_delete=models.PROTECT, default=0, verbose_name='parentDivision')

    class Meta:
        db_table = 'class_filter_fee'


class BusStopFilterFee(models.Model):

    parentSchoolFeeRule = models.ForeignKey(SchoolFeeRule, on_delete=models.CASCADE, default=0, verbose_name='parentSchoolFeeRule')
    parentBusStop = models.ForeignKey(BusStop, on_delete=models.CASCADE, default=0, verbose_name='parentBusStop')

    class Meta:
        db_table = 'bus_stop_filter_fee'


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

    class Meta:
        db_table = 'student_fee'
        unique_together = ('parentSchoolFeeRule', 'parentStudent')


class FeeReceipt(models.Model):

    # Why null=False replaced by blank=True in receiptNumber field of FeeReceipt Table?
    # @answer: null=False is the default behavior, no need to specify it. Blank=True is needed because
    # now this field is not comming from frontend and is not present in the data during save.
    # Receipt number is calculated in the signal.
    receiptNumber = models.IntegerField(blank=True, default=0)
    generationDateTime = models.DateTimeField(null=False, auto_now_add=True)
    remark = models.TextField(null=True)
    cancelled = models.BooleanField(null=False, default=False)

    # Added for the unique together field,
    # Also required in case fee receipt is cancelled, student is deleted, and we need to calculate the maximum receipt number
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0, related_name='FeeReceiptList')

    parentStudent = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, related_name='FeeReceiptList')
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=False, default=0, related_name='FeeReceiptList')
    parentEmployee = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='FeeReceiptList')

    chequeNumber = models.BigIntegerField(null=True, verbose_name='chequeNumber')

    cancelledDateTime = models.DateTimeField(null=True, verbose_name='cancelledDateTime')
    cancelledRemark = models.TextField(null=True, verbose_name='cancelledRemark')
    cancelledBy = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='CancelledFeeReceiptList')

    MODE_OF_PAYMENT = (
        ('Cash', 'Cash'),
        ('Cheque', 'Cheque'),
        ('Online', 'Online'),
        ('KORANGLE', 'KORANGLE'),
    )
    modeOfPayment = models.CharField(max_length=20, choices=MODE_OF_PAYMENT, null=True)
    parentTransaction = models.ForeignKey(Transaction, null=True, on_delete=models.SET_NULL, related_name='FeeReceiptList')

    ## Relations To School and Student ##
    RelationsToSchool = ['parentSchool__id', 'parentStudent__parentSchool__id', 'parentEmployee__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']

    class Meta:
        db_table = 'fee_receipt_new'
        unique_together = ('receiptNumber', 'parentSchool')

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
        last_receipt_number = FeeReceipt.objects.filter(parentSchool=instance.parentSchool)\
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

            ## Handling Student Fee Clearance Date and Cleared Starts ##
            subFeeReceiptList = originalInstance.subFeeReceiptList.all()
            for subFeeReceipt in subFeeReceiptList:
                studentFee = subFeeReceipt.parentStudentFee
                for month in INSTALLMENT_LIST:
                    if(getattr(subFeeReceipt, month + 'Amount') or getattr(subFeeReceipt, month + 'LateFee')):
                        setattr(studentFee, month + 'ClearanceDate', None)
                        studentFee.cleared = False
                studentFee.save()
            ## Handling Student Fee Clearance Date and Cleared Ends ##

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

    ## Relations To School and Student ##
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

    discountNumber = models.IntegerField(null=False, default=0, verbose_name='discountNumber')
    generationDateTime = models.DateTimeField(null=False, auto_now_add=True, verbose_name='generationDateTime')
    remark = models.TextField(null=True, verbose_name='remark')
    cancelled = models.BooleanField(null=False, default=False, verbose_name='cancelled')
    parentStudent = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, verbose_name='parentStudent')

    # Added for the unique together field,
    # Also required in case discount is cancelled, student is deleted, and we need to calculate the maximum discount number
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0, verbose_name='parentSchool')

    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentSession')
    parentEmployee = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, verbose_name='parentEmployee')

    class Meta:
        db_table = 'discount_new'
        unique_together = ('discountNumber', 'parentSchool')


@receiver(post_save, sender=Discount)
def discountPostSave(sender, instance: Discount, **kwargs):
    subDiscountList = instance.subDiscountList.all()
    for subDiscount in subDiscountList:
        receiptValidateAndUpdate(subDiscount.parentStudentFee)


class SubDiscount(models.Model):

    parentDiscount = models.ForeignKey(Discount, on_delete=models.PROTECT, default=0, verbose_name='parentDiscount')
    parentStudentFee = models.ForeignKey(StudentFee, on_delete=models.SET_NULL, null=True, verbose_name='parentStudentFee')
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentSession')
    parentFeeType = models.ForeignKey(FeeType, on_delete=models.PROTECT, default=0, verbose_name='parentFeeType')
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

    class Meta:
        db_table = 'sub_discount_new'


@receiver(post_save, sender=SubDiscount)
def subDiscountPostSave(sender, instance: SubDiscount, **kwargs):
    receiptValidateAndUpdate(instance.parentStudentFee)


def receiptValidateAndUpdate(studentFee, newSubFeeReceipt=SubFeeReceipt()):
    ## Initialization Starts ##
    subFeeReceiptList = studentFee.subfeereceipt_set.filter(parentFeeReceipt__cancelled=False)
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

        if paidAmount >= studentFeeAmount:
            isClearedMappedByMonth[month] = True

        ## Validations Starts ##

        if(getattr(studentFee, month + 'ClearanceDate')):  # month already cleared
            assert not getattr(newSubFeeReceipt, month + 'LateFee'), "incoming late fee after month fee is cleared"
            assert not getattr(newSubFeeReceipt, month + 'Amount'), "incoming amount after month fee is cleared"

        if getattr(studentFee, month + 'Amount') and getattr(studentFee, month + 'LastDate')\
                and getattr(studentFee, month + 'LateFee'):  # late fee
            delta = (getattr(studentFee, month + 'ClearanceDate') or datetime.now().date()) - getattr(studentFee, month + 'LastDate')
            lateFee = delta.days * getattr(studentFee, month + 'LateFee')
            if(getattr(studentFee, month + 'MaximumLateFee')):
                lateFee = max(lateFee, getattr(studentFee, month + 'MaximumLateFee'))

            for subDiscount in subDiscountList:
                lateFee -= getattr(subDiscount, month + 'LateFee') or 0

            totalPaidLateFee = 0
            for subFeeReceipt in subFeeReceiptList:
                totalPaidLateFee += getattr(subFeeReceipt, month + 'LateFee') or 0

            totalPaidLateFee += getattr(newSubFeeReceipt, month + 'LateFee') or 0

            if totalPaidLateFee < lateFee:
                isClearedMappedByMonth[month] = False
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


class FeeSettings(models.Model):
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE)
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT)
    sessionLocked = models.BooleanField(default=False)
    accountingSettingsJSON = models.TextField(null=True)  # json data

    class Meta:
        unique_together = ('parentSchool', 'parentSession')


class FeeReceiptOrder(models.Model):
    parentSchool = models.ForeignKey(School, on_delete=models.SET_NULL, null=True)
    parentOrder = models.ForeignKey(Order, on_delete=models.CASCADE)
    feeDetailJSON = models.TextField()
    parentFeeReceipt = models.ForeignKey(FeeReceipt, on_delete=models.PROTECT, null=True, blank=True)


@receiver(pre_save, sender=Order)
def FeeReceiptOrderCompletionHandler(sender, instance, **kwargs):
    if (not instance._state.adding) and instance.status == 'Completed':
        preSavedOrder = Order.objects.get(orderId=instance.orderId)
        if preSavedOrder.status == 'Pending':  # if status changed from 'Pending' to 'Completed'

            onlinePaymentTransactionList = FeeReceiptOrder.objects.filter(parentOrder=preSavedOrder)
            if len(onlinePaymentTransactionList) == 0:  # Order is made for some other purpose
                return

            activeSchoolID = onlinePaymentTransactionList[0].parentSchool.id

            # Code Review
            # 1. Will the status order be changed in few seconds from pending to completion or will it might take days.
            # @answer : It can take anywhere from seconds to days.
            # Current Session retrieval method can fail at the end of the session.
            # @answer: I have changed it confirm if this is what you meant.
            # I think this code will run with in few minutes of order placement by a parent. Please confirm.
            # @answer: Majority of times yes but not always
            currentSession = Session.objects.get(startDate__lte=datetime.now(), endDate__gte=datetime.now())
            debitAccount = None
            creditAccount = None
            try:
                feeSettings = FeeSettings.objects.get(parentSchool=activeSchoolID, parentSession=currentSession)
                if(feeSettings.accountingSettingsJSON):
                    accountingSettings = json.loads(feeSettings.accountingSettingsJSON)
                    debitAccount = AccountSession.objects.get(id=accountingSettings['parentAccountFrom']).parentAccount
                    creditAccount = AccountSession.objects.get(id=accountingSettings['parentOnlinePaymentCreditAccount']).parentAccount
            except:
                pass

            from fees_third_app.views import FeeReceiptView, SubFeeReceiptView
            FeeReceiptModelSerializer = FeeReceiptView().ModelSerializer
            SubFeeReceiptModelSerializer = SubFeeReceiptView().ModelSerializer

            with db_transaction.atomic():
                for onlinePaymentTransaction in onlinePaymentTransactionList:
                    feeDetailsList = json.loads(onlinePaymentTransaction.feeDetailJSON)
                    activeStudentID = StudentFee.objects.get(id=feeDetailsList[0]['parentStudentFee']).parentStudent.id
                    transaction_dict = {}
                    for field in FeeReceipt._meta.concrete_fields:  # all fields filed set to None
                        transaction_dict[field] = None

                    transaction_dict.update({
                        'parentSchool': activeSchoolID,
                        'parentStudent': activeStudentID,
                        'parentSession': feeDetailsList[0]['parentSession'],
                        'remark': 'Reference id: {0}'.format(instance.referenceId),
                        'modeOfPayment': 'KORANGLE',
                    })

                    response = create_object(transaction_dict, FeeReceiptModelSerializer, activeSchoolID, [activeStudentID])
                    newFeeReceipt = FeeReceipt.objects.get(id=response['id'])
                    onlinePaymentTransaction.parentFeeReceipt = newFeeReceipt
                    onlinePaymentTransaction.save()

                    if response['parentTransaction']:
                        transactionAccountDetailsModelSerializer = TransactionAccountDetailsView().ModelSerializer
                        create_object({
                            'parentTransaction': response['parentTransaction'],
                            'parentAccount': debitAccount.id,
                            'amount': 0,
                            'transactionType': 'CREDIT'
                        }, transactionAccountDetailsModelSerializer, activeSchoolID, [activeStudentID]
                        )

                        create_object({
                            'parentTransaction': response['parentTransaction'],
                            'parentAccount': creditAccount.id,
                            'amount': 0,
                            'transactionType': 'DEBIT'
                        }, transactionAccountDetailsModelSerializer, activeSchoolID, [activeStudentID]
                        )

                    ## populating parentFeeReceipt ##
                    for subFeeReceipt in feeDetailsList:
                        subFeeReceipt['parentFeeReceipt'] = newFeeReceipt.id
                    create_list(feeDetailsList, SubFeeReceiptModelSerializer, activeSchoolID, [activeStudentID])


# For handling refund in case an order fails
@receiver(pre_save, sender=Order)
def FeeAmountRefundHandler(sender, instance, **kwargs):
    if (not instance._state.adding) and instance.status == 'Refund Pending':
        preSavedOrder = Order.objects.get(orderId=instance.orderId)

        if preSavedOrder.status == 'Pending':  # if status changed from 'Pending' to 'Refund Pending'

            onlinePaymentTransactionList = FeeReceiptOrder.objects.filter(parentOrder=preSavedOrder)
            if len(onlinePaymentTransactionList) == 0:  # No attached OnlineFeePaymentTransaction row, Order is made for some other purpose
                return

            onlinePaymentAccount = SchoolMerchantAccount.objects.get(parentSchool=onlinePaymentTransactionList[0].parentSchool)

            splitDetails = [
                {
                    "merchantVendorId": onlinePaymentAccount.vendorId,
                    "amount": instance.amount,
                }
            ]

            response = initiateRefund(instance.orderId, splitDetails)
            instance.refundId = response['refundId']
            instance.status = 'Refund Initiated'
