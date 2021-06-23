from django.db import models, transaction
from rest_framework.serializers import ModelSerializer

from school_app.model.models import School, Session, BusStop

from class_app.models import Class, Division

from student_app.models import Student

from employee_app.models import Employee

from django.contrib.auth.models import User

from accounts_app.models import Accounts, Transaction, AccountSession, TransactionAccountDetails

from datetime import datetime

from django.dispatch import receiver
from django.db.models.signals import post_save, pre_save
from django.db.models import Max
import json

from common.common_serializer_interface_3 import create_object, create_list
from django.db import transaction as db_transaction

INSTALLMENT_LIST = [
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
    'january',
    'february',
    'march',
]


class FeeType(models.Model):

    name = models.TextField(verbose_name='name')
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0, verbose_name='parentSchool')
    orderNumber = models.IntegerField(verbose_name='orderNumber', default=0)

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

    receiptNumber = models.IntegerField(blank=True, default=0, verbose_name='receiptNumber')
    generationDateTime = models.DateTimeField(null=False, auto_now_add=True, verbose_name='generationDateTime')
    remark = models.TextField(null=True, verbose_name='remark')
    cancelled = models.BooleanField(null=False, default=False, verbose_name='cancelled')

    # Added for the unique together field,
    # Also required in case fee receipt is cancelled, student is deleted, and we need to calculate the maximum receipt number
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0, verbose_name='parentSchool')

    parentStudent = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, verbose_name='parentStudent')
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentSession')
    parentEmployee = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, verbose_name='parentEmployee', related_name='parentEmployee')

    chequeNumber = models.IntegerField(null=True, verbose_name='chequeNumber')

    cancelledDateTime = models.DateTimeField(null=True, verbose_name='cancelledDateTime')
    cancelledRemark = models.TextField(null=True, verbose_name='cancelledRemark')
    cancelledBy = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, verbose_name='cancelledBy', related_name='cancelledBy')

    MODE_OF_PAYMENT = (
        ( 'Cash', 'Cash' ),
        ( 'Cheque', 'Cheque' ),
        ( 'Online', 'Online'),
    )
    modeOfPayment = models.CharField(max_length=20, choices=MODE_OF_PAYMENT, null=True)
    parentTransaction = models.ForeignKey(Transaction, null=True, on_delete=models.SET_NULL) # what on delete, even 'PROTECT will give please refesth dialog box', on option: only delete transaction not fee receipt

    class Meta:
        db_table = 'fee_receipt_new'
        unique_together = ('receiptNumber', 'parentSchool')

@receiver(pre_save, sender=FeeReceipt)
def FeeReceiptPreSave(sender, instance, **kwargs):
    if not instance.id: # before Fee Receipt creation

        ## receipt number handling ##
        last_receipt_number = FeeReceipt.objects.filter(parentSchool=instance.parentSchool)\
                .aggregate(Max('receiptNumber'))['receiptNumber__max']
        instance.receiptNumber = (last_receipt_number or 0) +1

        ## Transaction Creation ##
        currentSession = Session.objects.get(startDate__lte = datetime.now(), endDate__gte = datetime.now())
        feeSettings = None
        try:
            feeSettings = FeeSettings.objects.get(parentSchool=instance.parentSchool, parentSession=currentSession)
        except:
            pass
        if(feeSettings and feeSettings.accountingSettingsJSON):
            instance.parentTransaction = Transaction.objects.create(
                parentEmployee = instance.parentEmployee,
                parentSchool = instance.parentSchool,
                transactionDate = datetime.now(),
                remark = 'Student Fee, receipt no.: {0}'.format(instance.receiptNumber)
            )

    ## Fee Receipt Cancellation Handler ##
    if instance.id and instance.cancelled:
        originalFeeReceipt = FeeReceipt.objects.get(id=instance.id)
        if originalFeeReceipt.cancelled==False and originalFeeReceipt.parentTransaction != None:
            originalFeeReceipt.parentTransaction.delete()
    pass



class SubFeeReceipt(models.Model):

    parentFeeReceipt = models.ForeignKey(FeeReceipt, on_delete=models.PROTECT, default=0, verbose_name='parentFeeReceipt')
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
        db_table = 'sub_fee_receipt__new'

@receiver(post_save, sender=SubFeeReceipt)
def handleAccountsTransaction(sender, instance, created, **kwargs):
    if(created and instance.parentFeeReceipt.parentTransaction):
        amount = 0
        for month in INSTALLMENT_LIST:
            if(getattr(instance, month+'Amount') is not None):
                amount += getattr(instance, month+'Amount')
            if(getattr(instance, month+'LateFee') is not None):
                amount += getattr(instance, month+'LateFee')
        creaditAccountDetail =  instance.parentFeeReceipt.parentTransaction.transactionaccountdetails_set.get(
            transactionType = 'CREDIT'
        )
        debitAccountDetail = instance.parentFeeReceipt.parentTransaction.transactionaccountdetails_set.get(
            transactionType = 'DEBIT'
        )
        creaditAccountDetail.amount += amount
        debitAccountDetail.amount += amount
        creaditAccountDetail.save()
        debitAccountDetail.save()


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


class FeeSettings(models.Model):
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE)
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT)
    sessionLocked = models.BooleanField(default=False)
    accountingSettingsJSON = models.TextField(null=True) # json data

    class Meta:
        unique_together = ('parentSchool', 'parentSession')
    
class OnlinePaymentAccount(models.Model):
    parentSchool = models.ForeignKey(School, unique=True, on_delete=models.CASCADE)


class Order(models.Model):
    TransactionStatus = (
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
        # ('Refund Initiated', 'Refund Initiated'),
        # ('Refunded', 'Refunded'),
        # ('Forwarded to School', 'Forwarded to School')
    )
    amount = models.PositiveIntegerField()
    status = models.CharField(max_length=30, choices=TransactionStatus, default='Pending')



from fees_third_app.views import FeeReceiptView, SubFeeReceiptView
from accounts_app.views import TransactionAccountDetailsView

@receiver(pre_save, sender=Order)
def OrderCompletionHandler(sender, instance, **kwargs):
    if instance.id and instance.status == 'Completed':
        preSavedOrder = Order.objects.get(id=instance.id)
        if preSavedOrder.status=='Pending': # if status changed from 'Pending' to 'Completed'

            transactionList = CashfreeTransaction.objects.filter(parentOrder = instance.id)
            activeSchoolID = transactionList[0].parentStudent.parentSchool.id

            currentSession = Session.objects.get(startDate__lte = datetime.now(), endDate__gte = datetime.now())
            debitAccount = None
            creditAccount = None
            try:
                feeSettings = FeeSettings.objects.get(parentSchool=activeSchoolID, parentSession=currentSession)
                if(feeSettings.accountingSettingsJSON):
                    accountingSessings = json.loads(feeSettings.accountingSettingsJSON)
                    debitAccount = AccountSession.objects.get(id=accountingSessings['parentAccountFrom']).parentAccount
                    creditAccount= AccountSession.objects.get(id=accountingSessings['parentOnlinePaymentCreditAccount']).parentAccount
            except:
                pass

            FeeReceiptModelSerializer = FeeReceiptView().ModelSerializer

            with db_transaction.atomic():
                for transaction in transactionList:
                    activeStudentID = transaction.parentStudent.id
                    feeDetailsList= json.loads(transaction.feeDetailJSON)

                    session_wise_fee_receipt_mapped_by_session_id = {}
                    for feeDetail in feeDetailsList:
                        session_wise_fee_receipt_mapped_by_session_id[feeDetail['parentSession']] = None
                    
                    for session_id in session_wise_fee_receipt_mapped_by_session_id.keys():
                        transaction_dict = {}

                        for field in FeeReceipt._meta.concrete_fields: 
                            transaction_dict[field] = None

                        transaction_dict.update({
                            'receiptNumber': (FeeReceipt.objects.filter(parentSchool=activeSchoolID)\
                                .aggregate(Max('receiptNumber'))['receiptNumber__max'] or 0)+1,
                            'parentSchool': activeSchoolID,
                            'parentStudent': activeStudentID,
                            'parentSession': session_id,
                            'modeOfPayment': 'Online'
                        })

                        response = create_object(transaction_dict, FeeReceiptModelSerializer, activeSchoolID, [activeStudentID])
                        session_wise_fee_receipt_mapped_by_session_id[session_id] = FeeReceipt.objects.get(id=response['id'])

                        if response['parentTransaction']:
                            transactionAccountDetailsModelSerializer = TransactionAccountDetailsView().ModelSerializer
                            create_object({
                                'parentTransaction': response['parentTransaction'],
                                'parentAccount': debitAccount.id,
                                'amount': 0,
                                'transactionType': 'DEBIT'
                            }, transactionAccountDetailsModelSerializer, activeSchoolID, [activeStudentID]
                            )

                            create_object({
                                'parentTransaction': response['parentTransaction'],
                                'parentAccount': creditAccount.id,
                                'amount': 0,
                                'transactionType': 'CREDIT'
                            }, transactionAccountDetailsModelSerializer, activeSchoolID, [activeStudentID]
                            )

                    for feeDetail in feeDetailsList:
                        feeDetail['parentFeeReceipt'] = session_wise_fee_receipt_mapped_by_session_id[feeDetail['parentSession']].id
                    SubFeeReceiptModelSerializer = SubFeeReceiptView().ModelSerializer
                    create_list(feeDetailsList, SubFeeReceiptModelSerializer, activeSchoolID, [activeStudentID])



    
class CashfreeTransaction(models.Model):
    parentStudent = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True)
    parentOrder = models.ForeignKey(Order, on_delete=models.CASCADE)
    feeDetailJSON = models.TextField()

