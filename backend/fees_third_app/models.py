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

from datetime import datetime, timedelta
import pytz
from accounts_app.models import Transaction, AccountSession

from django.dispatch import receiver
from django.db.models.signals import post_save, pre_save
from django.db.models import Max
from django.core.validators import MinValueValidator
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
    aprilAmount = models.IntegerField(null=True, verbose_name='aprilAmount', validators=[MinValueValidator(0)])
    aprilLastDate = models.DateField(null=True, verbose_name='aprilLastDate')
    aprilLateFee = models.IntegerField(null=True, verbose_name='aprilLateFee', validators=[MinValueValidator(0)])
    aprilMaximumLateFee = models.IntegerField(null=True, verbose_name='aprilMaximumLateFee', validators=[MinValueValidator(0)])

    # May
    mayAmount = models.IntegerField(null=True, verbose_name='mayAmount', validators=[MinValueValidator(0)])
    mayLastDate = models.DateField(null=True, verbose_name='mayLastDate')
    mayLateFee = models.IntegerField(null=True, verbose_name='mayLateFee', validators=[MinValueValidator(0)])
    mayMaximumLateFee = models.IntegerField(null=True, verbose_name='mayMaximumLateFee', validators=[MinValueValidator(0)])

    # June
    juneAmount = models.IntegerField(null=True, verbose_name='juneAmount', validators=[MinValueValidator(0)])
    juneLastDate = models.DateField(null=True, verbose_name='juneLastDate')
    juneLateFee = models.IntegerField(null=True, verbose_name='juneLateFee', validators=[MinValueValidator(0)])
    juneMaximumLateFee = models.IntegerField(null=True, verbose_name='juneMaximumLateFee', validators=[MinValueValidator(0)])

    # July
    julyAmount = models.IntegerField(null=True, verbose_name='julyAmount', validators=[MinValueValidator(0)])
    julyLastDate = models.DateField(null=True, verbose_name='julyLastDate')
    julyLateFee = models.IntegerField(null=True, verbose_name='julyLateFee', validators=[MinValueValidator(0)])
    julyMaximumLateFee = models.IntegerField(null=True, verbose_name='julyMaximumLateFee', validators=[MinValueValidator(0)])

    # August
    augustAmount = models.IntegerField(null=True, verbose_name='augustAmount', validators=[MinValueValidator(0)])
    augustLastDate = models.DateField(null=True, verbose_name='augustLastDate')
    augustLateFee = models.IntegerField(null=True, verbose_name='augustLateFee', validators=[MinValueValidator(0)])
    augustMaximumLateFee = models.IntegerField(null=True, verbose_name='augustMaximumLateFee', validators=[MinValueValidator(0)])

    # September
    septemberAmount = models.IntegerField(null=True, verbose_name='septemberAmount', validators=[MinValueValidator(0)])
    septemberLastDate = models.DateField(null=True, verbose_name='septemberLastDate')
    septemberLateFee = models.IntegerField(null=True, verbose_name='septemberLateFee', validators=[MinValueValidator(0)])
    septemberMaximumLateFee = models.IntegerField(null=True, verbose_name='septemberMaximumLateFee', validators=[MinValueValidator(0)])

    # October
    octoberAmount = models.IntegerField(null=True, verbose_name='octoberAmount', validators=[MinValueValidator(0)])
    octoberLastDate = models.DateField(null=True, verbose_name='octoberLastDate')
    octoberLateFee = models.IntegerField(null=True, verbose_name='octoberLateFee', validators=[MinValueValidator(0)])
    octoberMaximumLateFee = models.IntegerField(null=True, verbose_name='octoberMaximumLateFee', validators=[MinValueValidator(0)])

    # November
    novemberAmount = models.IntegerField(null=True, verbose_name='novemberAmount', validators=[MinValueValidator(0)])
    novemberLastDate = models.DateField(null=True, verbose_name='novemberLastDate')
    novemberLateFee = models.IntegerField(null=True, verbose_name='novemberLateFee', validators=[MinValueValidator(0)])
    novemberMaximumLateFee = models.IntegerField(null=True, verbose_name='novemberMaximumLateFee', validators=[MinValueValidator(0)])

    # December
    decemberAmount = models.IntegerField(null=True, verbose_name='decemberAmount', validators=[MinValueValidator(0)])
    decemberLastDate = models.DateField(null=True, verbose_name='decemberLastDate')
    decemberLateFee = models.IntegerField(null=True, verbose_name='decemberLateFee', validators=[MinValueValidator(0)])
    decemberMaximumLateFee = models.IntegerField(null=True, verbose_name='decemberMaximumLateFee', validators=[MinValueValidator(0)])

    # January
    januaryAmount = models.IntegerField(null=True, verbose_name='januaryAmount', validators=[MinValueValidator(0)])
    januaryLastDate = models.DateField(null=True, verbose_name='januaryLastDate')
    januaryLateFee = models.IntegerField(null=True, verbose_name='januaryLateFee', validators=[MinValueValidator(0)])
    januaryMaximumLateFee = models.IntegerField(null=True, verbose_name='januaryMaximumLateFee', validators=[MinValueValidator(0)])

    # February
    februaryAmount = models.IntegerField(null=True, verbose_name='februaryAmount', validators=[MinValueValidator(0)])
    februaryLastDate = models.DateField(null=True, verbose_name='februaryLastDate')
    februaryLateFee = models.IntegerField(null=True, verbose_name='februaryLateFee', validators=[MinValueValidator(0)])
    februaryMaximumLateFee = models.IntegerField(null=True, verbose_name='februaryMaximumLateFee', validators=[MinValueValidator(0)])

    # March
    marchAmount = models.IntegerField(null=True, verbose_name='marchAmount', validators=[MinValueValidator(0)])
    marchLastDate = models.DateField(null=True, verbose_name='marchLastDate')
    marchLateFee = models.IntegerField(null=True, verbose_name='marchLateFee', validators=[MinValueValidator(0)])
    marchMaximumLateFee = models.IntegerField(null=True, verbose_name='marchMaximumLateFee', validators=[MinValueValidator(0)])

    class Permissions(BasePermission):
        RelationsToSchool = ['parentFeeType__parentSchool__id']

    class Meta:
        db_table = 'school_fee_rule'
        unique_together = [('ruleNumber', 'parentFeeType', 'parentSession'), ('name', 'parentFeeType', 'parentSession')]

# check whether installments other april are null or not when isannually is true.
@receiver(pre_save, sender=SchoolFeeRule)
def SchoolFeeRulePreSave(sender, instance, **kwargs):

    if(kwargs['raw']):
        return

    # School fee Rule is created only from frontend

    for month in INSTALLMENT_LIST:

        amount = getattr(instance, month + 'Amount') or 0
        lastDate = getattr(instance, month + 'LastDate')
        lateFee = getattr(instance, month + 'LateFee') or 0
        maximumLateFee = getattr(instance, month + 'MaximumLateFee') or 0

        # check if is annually is true then installments other than april shouldn't be populated
        isAnnually = instance.isAnnually or False
        if isAnnually and month != 'april':
            assert not amount, str(instance.id) + ', ' + month + '\'s amount ' + str(amount) + ' shouldn\'t be present when isAnnually is true'
            assert not lastDate, str(instance.id) + ', ' + month + '\'s last date ' + str(lastDate) + ' shouldn\'t be present when isAnnually is true'
            assert not lateFee, str(instance.id) + ', ' + month + '\'s late fee ' + str(lateFee) + ' shouldn\'t be present when isAnnually is true'
            assert not maximumLateFee, str(instance.id) + ', ' + month + '\'s maximum late fee ' + str(maximumLateFee) + ' shouldn\'t be present when isAnnually is true'

        # last date should only be populated if amount is populated
        assert (lastDate and amount) or (not lastDate), month + '\'s last date is present but not amount'

        # late fee should only be populated if last date is populated
        assert (lateFee and lastDate) or (not lateFee), month + '\'s late fee is present but not last date'

        # maximum late fee should only be populated if late fee is populated
        assert (maximumLateFee and lateFee) or (not maximumLateFee), month + '\'s maximum late fee is present but not late fee'


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
    # to avoid fetching old cleared data for notify defaulters,
    # if notify defaulters page gets scrapped then I don't know where it will be used much,
    # May be in collect fees, we are not fetching old cleared fees. but that is not that pressing issue
    # as the data load in that scenario isn't that much. In notify defaulters the load was actually too much to avoid.

    # April
    aprilAmount = models.IntegerField(null=True, verbose_name='aprilAmount', validators=[MinValueValidator(0)])
    aprilLastDate = models.DateField(null=True, verbose_name='aprilLastDate')
    aprilLateFee = models.IntegerField(null=True, verbose_name='aprilLateFee', validators=[MinValueValidator(0)])
    aprilMaximumLateFee = models.IntegerField(null=True, verbose_name='aprilMaximumLateFee', validators=[MinValueValidator(0)])
    aprilClearanceDate = models.DateField(null=True, verbose_name='aprilClearanceDate')
    # clearance date is a meta data used to calculate late fees and cleared variable, so that last submitted date doesn't need to be calculated every time.
    # clearance date is only from main amount last submission date not from late fees last submission date,
    # there can be a case where amount is submitted then some previous fee receipt of late fees is cancelled
    # in that case clearance date will still be there, client would have to handle that scenario
    # by generating extra fee receipts or discounts for that late fees. In the eyes of software it is valid.

    # May
    mayAmount = models.IntegerField(null=True, verbose_name='mayAmount', validators=[MinValueValidator(0)])
    mayLastDate = models.DateField(null=True, verbose_name='mayLastDate')
    mayLateFee = models.IntegerField(null=True, verbose_name='mayLateFee', validators=[MinValueValidator(0)])
    mayMaximumLateFee = models.IntegerField(null=True, verbose_name='mayMaximumLateFee', validators=[MinValueValidator(0)])
    mayClearanceDate = models.DateField(null=True, verbose_name='mayClearanceDate')

    # June
    juneAmount = models.IntegerField(null=True, verbose_name='juneAmount', validators=[MinValueValidator(0)])
    juneLastDate = models.DateField(null=True, verbose_name='juneLastDate')
    juneLateFee = models.IntegerField(null=True, verbose_name='juneLateFee', validators=[MinValueValidator(0)])
    juneMaximumLateFee = models.IntegerField(null=True, verbose_name='juneMaximumLateFee', validators=[MinValueValidator(0)])
    juneClearanceDate = models.DateField(null=True, verbose_name='juneClearanceDate')

    # July
    julyAmount = models.IntegerField(null=True, verbose_name='julyAmount', validators=[MinValueValidator(0)])
    julyLastDate = models.DateField(null=True, verbose_name='julyLastDate')
    julyLateFee = models.IntegerField(null=True, verbose_name='julyLateFee', validators=[MinValueValidator(0)])
    julyMaximumLateFee = models.IntegerField(null=True, verbose_name='julyMaximumLateFee', validators=[MinValueValidator(0)])
    julyClearanceDate = models.DateField(null=True, verbose_name='julyClearanceDate')

    # August
    augustAmount = models.IntegerField(null=True, verbose_name='augustAmount', validators=[MinValueValidator(0)])
    augustLastDate = models.DateField(null=True, verbose_name='augustLastDate')
    augustLateFee = models.IntegerField(null=True, verbose_name='augustLateFee', validators=[MinValueValidator(0)])
    augustMaximumLateFee = models.IntegerField(null=True, verbose_name='augustMaximumLateFee', validators=[MinValueValidator(0)])
    augustClearanceDate = models.DateField(null=True, verbose_name='augustClearanceDate')

    # September
    septemberAmount = models.IntegerField(null=True, verbose_name='septemberAmount', validators=[MinValueValidator(0)])
    septemberLastDate = models.DateField(null=True, verbose_name='septemberLastDate')
    septemberLateFee = models.IntegerField(null=True, verbose_name='septemberLateFee', validators=[MinValueValidator(0)])
    septemberMaximumLateFee = models.IntegerField(null=True, verbose_name='septemberMaximumLateFee', validators=[MinValueValidator(0)])
    septemberClearanceDate = models.DateField(null=True, verbose_name='septemberClearanceDate')

    # October
    octoberAmount = models.IntegerField(null=True, verbose_name='octoberAmount', validators=[MinValueValidator(0)])
    octoberLastDate = models.DateField(null=True, verbose_name='octoberLastDate')
    octoberLateFee = models.IntegerField(null=True, verbose_name='octoberLateFee', validators=[MinValueValidator(0)])
    octoberMaximumLateFee = models.IntegerField(null=True, verbose_name='octoberMaximumLateFee', validators=[MinValueValidator(0)])
    octoberClearanceDate = models.DateField(null=True, verbose_name='octoberClearanceDate')

    # November
    novemberAmount = models.IntegerField(null=True, verbose_name='novemberAmount', validators=[MinValueValidator(0)])
    novemberLastDate = models.DateField(null=True, verbose_name='novemberLastDate')
    novemberLateFee = models.IntegerField(null=True, verbose_name='novemberLateFee', validators=[MinValueValidator(0)])
    novemberMaximumLateFee = models.IntegerField(null=True, verbose_name='novemberMaximumLateFee', validators=[MinValueValidator(0)])
    novemberClearanceDate = models.DateField(null=True, verbose_name='novemberClearanceDate')

    # December
    decemberAmount = models.IntegerField(null=True, verbose_name='decemberAmount', validators=[MinValueValidator(0)])
    decemberLastDate = models.DateField(null=True, verbose_name='decemberLastDate')
    decemberLateFee = models.IntegerField(null=True, verbose_name='decemberLateFee', validators=[MinValueValidator(0)])
    decemberMaximumLateFee = models.IntegerField(null=True, verbose_name='decemberMaximumLateFee', validators=[MinValueValidator(0)])
    decemberClearanceDate = models.DateField(null=True, verbose_name='decemberClearanceDate')

    # January
    januaryAmount = models.IntegerField(null=True, verbose_name='januaryAmount', validators=[MinValueValidator(0)])
    januaryLastDate = models.DateField(null=True, verbose_name='januaryLastDate')
    januaryLateFee = models.IntegerField(null=True, verbose_name='januaryLateFee', validators=[MinValueValidator(0)])
    januaryMaximumLateFee = models.IntegerField(null=True, verbose_name='januaryMaximumLateFee', validators=[MinValueValidator(0)])
    januaryClearanceDate = models.DateField(null=True, verbose_name='januaryClearanceDate')

    # February
    februaryAmount = models.IntegerField(null=True, verbose_name='februaryAmount', validators=[MinValueValidator(0)])
    februaryLastDate = models.DateField(null=True, verbose_name='februaryLastDate')
    februaryLateFee = models.IntegerField(null=True, verbose_name='februaryLateFee', validators=[MinValueValidator(0)])
    februaryMaximumLateFee = models.IntegerField(null=True, verbose_name='februaryMaximumLateFee', validators=[MinValueValidator(0)])
    februaryClearanceDate = models.DateField(null=True, verbose_name='februaryClearanceDate')

    # March
    marchAmount = models.IntegerField(null=True, verbose_name='marchAmount', validators=[MinValueValidator(0)])
    marchLastDate = models.DateField(null=True, verbose_name='marchLastDate')
    marchLateFee = models.IntegerField(null=True, verbose_name='marchLateFee', validators=[MinValueValidator(0)])
    marchMaximumLateFee = models.IntegerField(null=True, verbose_name='marchMaximumLateFee', validators=[MinValueValidator(0)])
    marchClearanceDate = models.DateField(null=True, verbose_name='marchClearanceDate')

    class Permissions(BasePermission):
        RelationsToSchool = ['parentFeeType__parentSchool__id', 'parentStudent__parentSchool__id', 'parentSchoolFeeRule__parentFeeType__parentSchool__id']
        RelationsToStudent = ['parentStudent__id']

    class Meta:
        db_table = 'student_fee'
        unique_together = ('parentSchoolFeeRule', 'parentStudent')


@receiver(pre_save, sender=StudentFee)
def StudentFeePreSave(sender, instance, **kwargs):

    if(kwargs['raw']):
        return

    old_instance = None
    subFeeReceiptList = []
    subDiscountList = []
    if instance.id:
        old_instance = StudentFee.objects.get(id=instance.id)
        subFeeReceiptList = old_instance.subFeeReceiptList.filter(parentFeeReceipt__cancelled=False)
        subDiscountList = old_instance.subDiscountList.filter(parentDiscount__cancelled=False)

    cleared = True

    for month in INSTALLMENT_LIST:

        amount = getattr(instance, month + 'Amount') or (old_instance and getattr(old_instance, month + 'Amount')) or 0
        lastDate = getattr(instance, month + 'LastDate') or (old_instance and getattr(old_instance, month + 'LastDate')) or None
        lateFee = getattr(instance, month + 'LateFee') or (old_instance and getattr(old_instance, month + 'LateFee')) or 0
        maximumLateFee = getattr(instance, month + 'MaximumLateFee') or (old_instance and getattr(old_instance, month + 'MaximumLateFee')) or 0

        # check if is annually is true then installments other than april shouldn't be populated
        isAnnually = instance.isAnnually or (old_instance and old_instance.isAnnually) or False
        if isAnnually and month != 'april':
            assert not amount, str(instance.id) + ', ' + month + '\'s amount ' + str(amount) + ' shouldn\'t be present when isAnnually is true'
            assert not lastDate, str(instance.id) + ', ' + month + '\'s last date ' + str(lastDate) + ' shouldn\'t be present when isAnnually is true'
            assert not lateFee, str(instance.id) + ', ' + month + '\'s late fee ' + str(lateFee) + ' shouldn\'t be present when isAnnually is true'
            assert not maximumLateFee, str(instance.id) + ', ' + month + '\'s maximum late fee ' + str(maximumLateFee) + ' shouldn\'t be present when isAnnually is true'

        # last date should only be populated if amount is populated
        assert (lastDate and amount) or (not lastDate), month + '\'s last date is present but not amount'

        # late fee should only be populated if last date is populated
        assert (lateFee and lastDate) or (not lateFee), month + '\'s late fee is present but not last date'

        # maximum late fee should only be populated if late fee is populated
        assert (maximumLateFee and lateFee) or (not maximumLateFee), month + '\'s maximum late fee is present but not late fee'

        # Starts :- Calculate submitted amount and date
        lastSubmittedDate = pytz.utc.localize(datetime(1980, 1, 1))
        submittedAmount = 0
        submittedLateAmount = 0

        for subFeeReceipt in subFeeReceiptList:
            paidFee = getattr(subFeeReceipt, month + 'Amount') or 0
            submittedAmount += paidFee
            if paidFee > 0:
                lastSubmittedDate = max(lastSubmittedDate, subFeeReceipt.parentFeeReceipt.generationDateTime + timedelta(hours=5, minutes=30))
            submittedLateAmount += getattr(subFeeReceipt, month + 'LateFee') or 0

        for subDiscount in subDiscountList:
            givenDiscount = getattr(subDiscount, month + 'Amount') or 0
            submittedAmount += givenDiscount
            if givenDiscount > 0:
                lastSubmittedDate = max(lastSubmittedDate, subDiscount.parentDiscount.generationDateTime + timedelta(hours=5, minutes=30))
            submittedLateAmount += getattr(subDiscount, month + 'LateFee') or 0
        # Ends :- Calculate submitted amount and date

        # Check main amount validity
        assert submittedAmount <= amount, month + '\'s paid amount is greater than demand amount.'

        # Set clearance date for installments
        if amount == 0:
            setattr(instance, month + 'ClearanceDate', None)
        elif submittedAmount == amount:
            setattr(instance, month + 'ClearanceDate', lastSubmittedDate.date())
        else:
            setattr(instance, month + 'ClearanceDate', None)
            cleared = False

        # Starts :- Check late amount validity, it is getting calculated & checked afterwards because we need clearance date to be calculated before.
        lateAmount = 0
        if lateFee:  # late fee
            deltaDays = ((getattr(instance, month + 'ClearanceDate') or datetime.now().date()) - lastDate).days
            deltaDays = max(deltaDays, 0)
            lateAmount = deltaDays * lateFee
            if maximumLateFee:
                lateAmount = min(lateAmount, maximumLateFee)

        assert submittedLateAmount <= lateAmount, month + "'s total paid late fee is exceeding actual late fee"
        # Ends :- Check late amount validity, it is getting calculated & checked afterwards because we need clearance date to be calculated before.

        # Following can generate problems if fee receipt of only late amount is being cancelled. And we shouldn't be stopping that
        # Intention is to stop receipt generation of main amount while late amount is scrapped off.
        # I think we can do without submission of late amount even if main amount is submitted. There shouldn't be any problems in code.
        # If due fees is visible because of late fees then user can generate discount to handle that case on his own so that shouldn't be an issue.
        # Finally commenting below two lines.
        '''if submittedLateAmount < lateAmount and submittedAmount > 0:
            assert False, "incoming fee amount without clearing late fee"'''

    # set the cleared variable
    setattr(instance, 'cleared', cleared)


class FeeReceiptBook(models.Model):

    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE, default=0, related_name='feeReceiptBookList')
    name = models.TextField()
    receiptNumberPrefix = models.TextField(default='', blank=True)
    active = models.BooleanField(default=True) # whether to use in collect fees while generating receipt

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']
        RelationsToStudent = []

    class Meta:
        db_table = 'fee_receipt_book'
        unique_together=(('parentSchool', 'name'), ('parentSchool', 'receiptNumberPrefix'))

@receiver(post_save, sender=School)
def SchoolCreationHandler(sender, instance, created, **kwargs):
    if(kwargs['raw']):
        return
    if created:
        FeeReceiptBook.objects.create(name='Default', parentSchool=instance)


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


# this is important when fee receipt is cancelled, then sub fee receipt isn't touched
# so student fee meta data (cleared, clearance date) needs to be handled from here.
@receiver(post_save, sender=FeeReceipt)
def FeeReceiptPostSave(sender, instance: FeeReceipt, **kwargs):
    if(kwargs['raw']):
        return
    if instance.cancelled:
        subFeeReceiptList = instance.subFeeReceiptList.all()
        for subFeeReceipt in subFeeReceiptList:
            subFeeReceipt.parentStudentFee.save()

class SubFeeReceipt(models.Model):

    parentFeeReceipt = models.ForeignKey(FeeReceipt, on_delete=models.PROTECT, default=0, related_name='subFeeReceiptList')
    parentStudentFee = models.ForeignKey(StudentFee, on_delete=models.SET_NULL, null=True, related_name='subFeeReceiptList')
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=False, default=0, related_name='subFeeReceiptList')
    parentFeeType = models.ForeignKey(FeeType, on_delete=models.PROTECT, default=0, related_name='subFeeReceiptList')
    isAnnually = models.BooleanField(verbose_name='isAnnually', default=False)

    # April
    aprilAmount = models.IntegerField(null=True, verbose_name='aprilAmount', validators=[MinValueValidator(0)])
    aprilLateFee = models.IntegerField(null=True, verbose_name='aprilLateFee', validators=[MinValueValidator(0)])

    # May
    mayAmount = models.IntegerField(null=True, verbose_name='mayAmount', validators=[MinValueValidator(0)])
    mayLateFee = models.IntegerField(null=True, verbose_name='mayLateFee', validators=[MinValueValidator(0)])

    # June
    juneAmount = models.IntegerField(null=True, verbose_name='juneAmount', validators=[MinValueValidator(0)])
    juneLateFee = models.IntegerField(null=True, verbose_name='juneLateFee', validators=[MinValueValidator(0)])

    # July
    julyAmount = models.IntegerField(null=True, verbose_name='julyAmount', validators=[MinValueValidator(0)])
    julyLateFee = models.IntegerField(null=True, verbose_name='julyLateFee', validators=[MinValueValidator(0)])

    # August
    augustAmount = models.IntegerField(null=True, verbose_name='augustAmount', validators=[MinValueValidator(0)])
    augustLateFee = models.IntegerField(null=True, verbose_name='augustLateFee', validators=[MinValueValidator(0)])

    # September
    septemberAmount = models.IntegerField(null=True, verbose_name='septemberAmount', validators=[MinValueValidator(0)])
    septemberLateFee = models.IntegerField(null=True, verbose_name='septemberLateFee', validators=[MinValueValidator(0)])

    # October
    octoberAmount = models.IntegerField(null=True, verbose_name='octoberAmount', validators=[MinValueValidator(0)])
    octoberLateFee = models.IntegerField(null=True, verbose_name='octoberLateFee', validators=[MinValueValidator(0)])

    # November
    novemberAmount = models.IntegerField(null=True, verbose_name='novemberAmount', validators=[MinValueValidator(0)])
    novemberLateFee = models.IntegerField(null=True, verbose_name='novemberLateFee', validators=[MinValueValidator(0)])

    # December
    decemberAmount = models.IntegerField(null=True, verbose_name='decemberAmount', validators=[MinValueValidator(0)])
    decemberLateFee = models.IntegerField(null=True, verbose_name='decemberLateFee', validators=[MinValueValidator(0)])

    # January
    januaryAmount = models.IntegerField(null=True, verbose_name='januaryAmount', validators=[MinValueValidator(0)])
    januaryLateFee = models.IntegerField(null=True, verbose_name='januaryLateFee', validators=[MinValueValidator(0)])

    # February
    februaryAmount = models.IntegerField(null=True, verbose_name='februaryAmount', validators=[MinValueValidator(0)])
    februaryLateFee = models.IntegerField(null=True, verbose_name='februaryLateFee', validators=[MinValueValidator(0)])

    # March
    marchAmount = models.IntegerField(null=True, verbose_name='marchAmount', validators=[MinValueValidator(0)])
    marchLateFee = models.IntegerField(null=True, verbose_name='marchLateFee', validators=[MinValueValidator(0)])

    class Permissions(BasePermission):
        RelationsToSchool = ['parentFeeReceipt__parentSchool__id', 'parentStudentFee__parentStudent__parentSchool__id', 'parentFeeType__parentSchool__id']
        RelationsToStudent = ['parentStudentFee__parentStudent__id', 'parentFeeReceipt__parentStudent__id']

    @db_transaction.atomic
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    class Meta:
        db_table = 'sub_fee_receipt__new'


# check whether sub fee receipt amount is not completely zero. there is at least one installment present.
@receiver(pre_save, sender=SubFeeReceipt)
def subFeeReceiptPreSave(sender, instance: SubFeeReceipt, **kwargs):
    if(kwargs['raw']):
        return
    # Checking whether there is at least one non-zero amount is present.
    present = False
    for month in INSTALLMENT_LIST:
        if (
            (getattr(instance, month + 'Amount') or 0) > 0
        ) or (
            (getattr(instance, month + 'LateFee') or 0) > 0
        ):
            present = True
            break
    assert present, "Sub Fee Receipt doesn't contain any amount."

# This is important when fee receipt is generated, unless sub fee receipt is generated in database
# there is no point in calling student fee save function, that's why it is handled in sub fee receipt's
# post save function and not from fee receipt's post save function.
@receiver(post_save, sender=SubFeeReceipt)
def subFeeReceiptPostSave(sender, instance: SubFeeReceipt, **kwargs):
    if(kwargs['raw']):
        return
    instance.parentStudentFee.save()


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

# this is important when discount is cancelled, then sub discount isn't touched
# so student fee meta data (cleared, clearance date) needs to be handled from here.
@receiver(post_save, sender=Discount)
def discountPostSave(sender, instance: Discount, **kwargs):
    if(kwargs['raw']):
        return
    if instance.cancelled:
        subDiscountList = instance.subDiscount.all()
        for subDiscount in subDiscountList:
            subDiscount.parentStudentFee.save()


class SubDiscount(models.Model):

    parentDiscount = models.ForeignKey(Discount, on_delete=models.PROTECT, default=0, related_name='subDiscountList')
    parentStudentFee = models.ForeignKey(StudentFee, on_delete=models.SET_NULL, null=True, related_name='subDiscountList')
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=False, default=0, related_name='subDiscountList')
    parentFeeType = models.ForeignKey(FeeType, on_delete=models.PROTECT, default=0, related_name='subDiscountList')
    isAnnually = models.BooleanField(verbose_name='isAnnually', default=False)

    # April
    aprilAmount = models.IntegerField(null=True, verbose_name='aprilAmount', validators=[MinValueValidator(0)])
    aprilLateFee = models.IntegerField(null=True, verbose_name='aprilLateFee', validators=[MinValueValidator(0)])

    # May
    mayAmount = models.IntegerField(null=True, verbose_name='mayAmount', validators=[MinValueValidator(0)])
    mayLateFee = models.IntegerField(null=True, verbose_name='mayLateFee', validators=[MinValueValidator(0)])

    # June
    juneAmount = models.IntegerField(null=True, verbose_name='juneAmount', validators=[MinValueValidator(0)])
    juneLateFee = models.IntegerField(null=True, verbose_name='juneLateFee', validators=[MinValueValidator(0)])

    # July
    julyAmount = models.IntegerField(null=True, verbose_name='julyAmount', validators=[MinValueValidator(0)])
    julyLateFee = models.IntegerField(null=True, verbose_name='julyLateFee', validators=[MinValueValidator(0)])

    # August
    augustAmount = models.IntegerField(null=True, verbose_name='augustAmount', validators=[MinValueValidator(0)])
    augustLateFee = models.IntegerField(null=True, verbose_name='augustLateFee', validators=[MinValueValidator(0)])

    # September
    septemberAmount = models.IntegerField(null=True, verbose_name='septemberAmount', validators=[MinValueValidator(0)])
    septemberLateFee = models.IntegerField(null=True, verbose_name='septemberLateFee', validators=[MinValueValidator(0)])

    # October
    octoberAmount = models.IntegerField(null=True, verbose_name='octoberAmount', validators=[MinValueValidator(0)])
    octoberLateFee = models.IntegerField(null=True, verbose_name='octoberLateFee', validators=[MinValueValidator(0)])

    # November
    novemberAmount = models.IntegerField(null=True, verbose_name='novemberAmount', validators=[MinValueValidator(0)])
    novemberLateFee = models.IntegerField(null=True, verbose_name='novemberLateFee', validators=[MinValueValidator(0)])

    # December
    decemberAmount = models.IntegerField(null=True, verbose_name='decemberAmount', validators=[MinValueValidator(0)])
    decemberLateFee = models.IntegerField(null=True, verbose_name='decemberLateFee', validators=[MinValueValidator(0)])

    # January
    januaryAmount = models.IntegerField(null=True, verbose_name='januaryAmount', validators=[MinValueValidator(0)])
    januaryLateFee = models.IntegerField(null=True, verbose_name='januaryLateFee', validators=[MinValueValidator(0)])

    # February
    februaryAmount = models.IntegerField(null=True, verbose_name='februaryAmount', validators=[MinValueValidator(0)])
    februaryLateFee = models.IntegerField(null=True, verbose_name='februaryLateFee', validators=[MinValueValidator(0)])

    # March
    marchAmount = models.IntegerField(null=True, verbose_name='marchAmount', validators=[MinValueValidator(0)])
    marchLateFee = models.IntegerField(null=True, verbose_name='marchLateFee', validators=[MinValueValidator(0)])

    class Permissions(BasePermission):
        RelationsToSchool = ['parentDiscount__parentSchool__id', 'parentStudentFee__parentStudent__parentSchool__id', 'parentFeeType__parentSchool__id']
        RelationsToStudent = ['parentDiscount__parentStudent__id', 'parentStudentFee__parentStudent__id']

    class Meta:
        db_table = 'sub_discount_new'

# check whether sub discount amount is not completely zero. there is at least one installment present.
@receiver(pre_save, sender=SubDiscount)
def subDiscountPreSave(sender, instance: SubDiscount, **kwargs):
    if(kwargs['raw']):
        return
    # Checking whether there is at least one non-zero amount is present.
    present = False
    for month in INSTALLMENT_LIST:
        if (
            (getattr(instance, month + 'Amount') or 0) > 0
        ) or (
            (getattr(instance, month + 'LateFee') or 0) > 0
        ):
            present = True
            break
    assert present, "Sub Discount doesn't contain any amount."

# This is important when discount is generated, unless sub discount is generated in database
# there is no point in calling student fee save function, that's why it is handled in sub discount's
# post save function and not from discount's post save function.
@receiver(post_save, sender=SubDiscount)
def subDiscountPostSave(sender, instance: SubDiscount, **kwargs):
    if(kwargs['raw']):
        return
    instance.parentStudentFee.save()


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
