# Code Review
# Why is split imported from re
# @answer : It mush have been imported due to auto completion by mistake I am removing it
from django.core.serializers import serialize
from payment_app.cashfree.cashfree import initiateRefund
from payment_app.models import OnlinePaymentAccount
from accounts_app.views import TransactionAccountDetailsView
from fees_third_app.views import FeeReceiptView, SubFeeReceiptView
from django.db import models

# Code Review
# Why is RawSQL imported
# @answer : It mush have been imported due to auto completion by mistake I am removing it

# Code Review
# Why is ModelSerializer imported?
# @answer : It mush have been imported due to auto completion by mistake I am removing it

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

# Code Review
# Why is transaction imported a second time?
# @answer : I have removed the first time, it was by mistake
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

    # Code Review
    # Why null=False replaced by blank=True in receiptNumber field of FeeReceipt Table?
    # @answer: null=False is the default behavior, no need to specify it. Blank=True is needed because now this field is not comming from frontend and is not present in the data during save. Receipt number is calculated in the signal.
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

    chequeNumber = models.BigIntegerField(null=True, verbose_name='chequeNumber')

    cancelledDateTime = models.DateTimeField(null=True, verbose_name='cancelledDateTime')
    cancelledRemark = models.TextField(null=True, verbose_name='cancelledRemark')
    cancelledBy = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, verbose_name='cancelledBy', related_name='cancelledBy')

    MODE_OF_PAYMENT = (
        ('Cash', 'Cash'),
        ('Cheque', 'Cheque'),
        ('Online', 'Online'),
        ('KORANGLE', 'KORANGLE'),
    )
    modeOfPayment = models.CharField(max_length=20, choices=MODE_OF_PAYMENT, null=True)
    # what on delete, even 'PROTECT will give please refesth dialog box', on option: only delete transaction not fee receipt
    parentTransaction = models.ForeignKey(Transaction, null=True, on_delete=models.SET_NULL)

    class Meta:
        db_table = 'fee_receipt_new'
        unique_together = ('receiptNumber', 'parentSchool')

    def save(self, *args, **kwargs):
        if self.id is None:
            with db_transaction.atomic():
                super().save(*args, **kwargs)
        else:
            super().save(*args, **kwargs)


# Code Review
# Why the pre_save signal not implemented for Discount model like it is handled for FeeReceipt model?
# Is it still being handled from frontend? Can we move it to backend? Not talking about Transaction but Cancellation.
# Also more commenting is required inside this function, like you did in pre save signal of Fee Receipt.
# @answer : I wasn't working near discount so I didn't implemented it, but can be implemented.
# What do you mean by "Not talking about Transaction but Cancellation" and which function requires more commenting?

@receiver(pre_save, sender=FeeReceipt)
def FeeReceiptPreSave(sender, instance, **kwargs):
    if(kwargs['raw']):
        return
    if not instance.id:  # before Fee Receipt creation

        # Code Review
        # Is atomic transaction not required for calculating last fee receipt number?
        # @answer : It is required but even then it will not cover all the cases. That's why I have added transaction atomic in FeeReceipt Save Function
        ## receipt number handling ##
        last_receipt_number = FeeReceipt.objects.filter(parentSchool=instance.parentSchool)\
            .aggregate(Max('receiptNumber'))['receiptNumber__max']
        instance.receiptNumber = (last_receipt_number or 0) + 1

        ## Transaction Creation ##
        currentSession = Session.objects.get(startDate__lte=datetime.now(), endDate__gte=datetime.now())
        feeSettings = None
        try:
            feeSettings = FeeSettings.objects.get(parentSchool=instance.parentSchool, parentSession=currentSession)
        except:
            pass
        if(feeSettings and feeSettings.accountingSettingsJSON):
            accountingSettings = json.loads(feeSettings.accountingSettingsJSON)
            modeOfPayment = instance.modeOfPayment

            # Code Review
            # 1. Why is this 'and len(accountingSettings['toAccountsStructure'].get(modeOfPayment))>0' required after
            # checking this 'accountingSettings['toAccountsStructure'].get(modeOfPayment, None)'
            # @answer : accountingSettings['toAccountsStructure'] contains the list of account and it can be empty. So I am checking if toAccountsStructure is not none and not empty.
            # 2. Comment Why transaction row needs to be created here.
            # @answer : Done
            ## Transaction Handling based on FeeSettings on School ##
            if (modeOfPayment == 'KORANGLE' and accountingSettings.get('parentOnlinePaymentCreditAccount', None))\
                or (modeOfPayment != 'KORANGLE' and accountingSettings['toAccountsStructure'].get(modeOfPayment, None)
                    and len(accountingSettings['toAccountsStructure'].get(modeOfPayment)) > 0):
                instance.parentTransaction = Transaction.objects.create(
                    parentEmployee=instance.parentEmployee,
                    parentSchool=instance.parentSchool,
                    transactionDate=datetime.now(),
                    remark='Student Fee, receipt no.: {0}'.format(instance.receiptNumber)
                )

    ## Fee Receipt Cancellation Handler ##
    if instance.id and instance.cancelled:
        # Code Review
        # Do we need to check the conditions of original fee receipt?
        originalFeeReceipt = FeeReceipt.objects.get(id=instance.id)
        if originalFeeReceipt.cancelled == False and originalFeeReceipt.parentTransaction != None:
            originalFeeReceipt.parentTransaction.delete()

        ## Clearance Date and Cleared ##
        subFeeReceiptSet = originalFeeReceipt.subfeereceipt_set.all()
        for subFeeReceipt in subFeeReceiptSet:
            studentFee = subFeeReceipt.parentStudentFee
            for month in INSTALLMENT_LIST:
                if(getattr(subFeeReceipt, month+'Amount') or getattr(subFeeReceipt, month+'LateFee')):
                    setattr(studentFee, month+'ClearanceDate', None)
                    studentFee.cleared = False
            studentFee.save()
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


# Code Review
# Why the pre_save signal not implemented for SubDiscount model like it is handled for SubFeeReceipt model?
# Is it still being handled from frontend? Can we move it to backend?
# @answer : I didn't implement it as I ws not working near it. Yes it is still being handled from frontend and it can be moved to backend.


@receiver(pre_save, sender=SubFeeReceipt)
def subFeeReceiptDataCheck(sender, instance, **kwargs):
    ## Initialization ##
    studentFee = instance.parentStudentFee
    subFeeReceiptSet = studentFee.subfeereceipt_set.filter(parentFeeReceipt__cancelled=False)
    subDiscountSet = SubDiscount.objects.filter(parentDiscount__cancelled=False, parentStudentFee=studentFee)

    isClearedMappedByMonth = {}  # To store month wise clearance
    for month in INSTALLMENT_LIST:
        isClearedMappedByMonth[month] = False  # Initialize all months as False

    ## Monthwise Validity Check For New SubFeeReceipt ##
    for month in INSTALLMENT_LIST:
        amount = 0
        if(getattr(instance, month+'Amount')):
            amount += getattr(instance, month+'Amount')  # Add the amount of to be created SubFeeReceipt

            for subFeeReceipt in subFeeReceiptSet:
                if getattr(subFeeReceipt, month+'Amount'):
                    amount += getattr(subFeeReceipt, month+'Amount')  # Add the amount of to be saved SubFeeReceipt

            for subDiscount in subDiscountSet:
                if getattr(subDiscount, month+'Amount'):
                    amount -= getattr(subDiscount, month+'Amount')  # Subtract the discounted amount

            studentFeeAmount = 0
            if getattr(studentFee, month+'Amount'):
                studentFeeAmount += getattr(studentFee, month+'Amount')  # Get the amount of studentFee

            # Code Review
            # 'Installent' - Spelling is wrong
            # @answer : I have corrected it.
            assert amount <= studentFeeAmount, "Installent amount exceeds actual amount"  # Validity Check for amount should be less than student fee

            if(amount == studentFeeAmount):
                isClearedMappedByMonth[month] = True

        ## Validations ##

        if(getattr(studentFee, month+'ClearanceDate')):  # month cleared
            # Code Review
            # What happens when the four implemented assert fails ? We are already checking
            # this once on frontend, right? This type of assertion is more useful, if we are saving
            # the whole fee receipt in a single instance, here we have already saved the feeReceipt row and
            # generated a receipt number, will the correct fee receipt be generated in frontend
            # if one of the multiple subFeeReceipts are not saved in backend? Should we radically
            # change the post api of fee receipts in backend, because even when we are checking so many things in
            # backend, it is not ultimately helping in keeping the integrity of data
            # as fee receipt is already generated.
            assert not getattr(instance, month+'LateFee'), "incoming late fee after month fee is cleared"

        elif getattr(studentFee, month+'Amount') and getattr(studentFee, month+'LastDate')\
                and getattr(studentFee, month+'LateFee'):  # late fee not cleared
            delta = datetime.now().date() - getattr(studentFee, month+'LastDate')
            lateFee = delta.days * getattr(studentFee, month+'LateFee')
            if(getattr(studentFee, month+'MaximumLateFee')):
                lateFee = max(lateFee, getattr(studentFee, month+'MaximumLateFee'))

            for subDiscount in subDiscountSet:
                if getattr(subDiscount, month+'LateFee'):
                    lateFee -= getattr(subDiscount, month+'LateFee')

            totalPaidLateFee = 0
            for subFeeReceipt in subFeeReceiptSet:
                if getattr(subFeeReceipt, month+'LateFee'):
                    totalPaidLateFee += getattr(subFeeReceipt, month+'LateFee')

            if getattr(instance, month+'LateFee'):
                totalPaidLateFee += getattr(instance, month+'LateFee')

            if totalPaidLateFee < lateFee:
                assert amount == 0, "incoming fee amount without clearing late fee"
            elif totalPaidLateFee > lateFee:
                assert False, "paid late fee exceeds actual late fee"

    ## Cleared and Cleared Date Handling for Student Fee ##
    cleared = True
    for month in INSTALLMENT_LIST:
        cleared = cleared and isClearedMappedByMonth[month]
        if(isClearedMappedByMonth[month]):
            setattr(studentFee, month+'ClearanceDate', datetime.now())
    if(cleared):
        studentFee.cleared = True
    studentFee.save()


# Code Review
# Are we not calling the post/put/patch api of models in account app at all,
# when creating a fee receipt?
# @answer: I will walk you through the stept:
# 1. Create a fee receipt instance(Transaction is automatically created if needed in accounts_app)
# Based of the payment mode and uset's selection of account created Transacton Account Details credit and debit rows with amount 0(frontend's post api call to accounts_app)
# When the sub fee receipts are created, the amount is added to the transaction account details for the parent Transation of subFeeReceipt
@receiver(post_save, sender=SubFeeReceipt)
def handleAccountsTransaction(sender, instance, created, **kwargs):
    if(created and instance.parentFeeReceipt.parentTransaction):
        amount = 0
        for month in INSTALLMENT_LIST:
            if(getattr(instance, month+'Amount') is not None):
                amount += getattr(instance, month+'Amount')
            if(getattr(instance, month+'LateFee') is not None):
                amount += getattr(instance, month+'LateFee')
        # Code Review
        # 'creaditAccountDetail' - Spelling is wrong
        # @answer: Fixed
        creditAccountDetail = instance.parentFeeReceipt.parentTransaction.transactionaccountdetails_set.get(
            transactionType='CREDIT'
        )
        debitAccountDetail = instance.parentFeeReceipt.parentTransaction.transactionaccountdetails_set.get(
            transactionType='DEBIT'
        )
        creditAccountDetail.amount += amount
        debitAccountDetail.amount += amount
        creditAccountDetail.save()
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
    accountingSettingsJSON = models.TextField(null=True)  # json data

    class Meta:
        unique_together = ('parentSchool', 'parentSession')


# Code Review
# 1. Would it be more understandable if we change the model name
# from OnlineFeePaymentTransaction to FeeReceiptOrder? (Point No. 22 - Code Practice File)
# @answer: Point No. 22 - Code Practice File ????
# 2. Why is models.set_null for parentSchool,
# but models.protect for parentFeeReceipt for online Fee payment transaction model.
# @answer : A fee receipt should not be deleted if is created due to an online payment. Otheriwse we will have no of mapping student's payment to why it was paid and what happened for that paymet.
# Since we are not deleteing schools we can use models.PROTECT for parentSchool also.
class OnlineFeePaymentTransaction(models.Model):
    parentSchool = models.ForeignKey(School, on_delete=models.SET_NULL, null=True)
    parentOrder = models.ForeignKey(Order, on_delete=models.CASCADE)
    feeDetailJSON = models.TextField()
    parentFeeReceipt = models.ForeignKey(FeeReceipt, on_delete=models.PROTECT, null=True, blank=True)


# Code Review
# Why is the signal for another Order model is not implemented in the same file as the model?
# @answer : This OrderCompletionHandler Signal is makes changes to the fees_third app that's why.
# Is this signal implemented w.r.t. to OnlineFeePaymentTransaction? Is it implemented with the future possibility
# that multiple OrderCompletionHandler will be implemented in different files?
# @answer : Yes, currently both sms and fee_third app are useing pre_save signal form Order Model.
# 2. Would it be more understandable if we rename it the below function to FeeReceiptOrderCompletionHandler
# @answer : Done
@receiver(pre_save, sender=Order)
def FeeReceiptOrderCompletionHandler(sender, instance, **kwargs):
    if (not instance._state.adding) and instance.status == 'Completed':
        preSavedOrder = Order.objects.get(orderId=instance.orderId)
        if preSavedOrder.status == 'Pending':  # if status changed from 'Pending' to 'Completed'

            onlinePaymentTransactionList = OnlineFeePaymentTransaction.objects.filter(parentOrder=preSavedOrder)
            if len(onlinePaymentTransactionList) == 0:  # Order is made for some other purpose
                return

            activeSchoolID = onlinePaymentTransactionList[0].parentSchool.id

            # Code Review
            # 1. Will the status order be changed in few seconds from pending to completion or will it might take days.
            # @answer : It can take anywhere from seconds to days.
            # Current Session retrieval method can fail at the end of the session.
            # @answer: I have changes it confirm if this is what you meant.
            # I think this code will run with in few minutes of order placement by a parent. Please confirm.
            # @answer: Majority of times yes but not always
            currentSession = Session.objects.get(startDate__lte=instance.dataTime, endDate__gte=instance.dataTime)
            debitAccount = None
            creditAccount = None
            try:
                feeSettings = FeeSettings.objects.get(parentSchool=activeSchoolID, parentSession=currentSession)
                if(feeSettings.accountingSettingsJSON):
                    # Code Review
                    # 'accountingSessings' -  Spelling is wrong
                    # @answer: Fixed
                    accountingSettings = json.loads(feeSettings.accountingSettingsJSON)
                    debitAccount = AccountSession.objects.get(id=accountingSettings['parentAccountFrom']).parentAccount
                    creditAccount = AccountSession.objects.get(id=accountingSettings['parentOnlinePaymentCreditAccount']).parentAccount
            except:
                pass

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
                    # Code Review
                    # 'parentFeereceipt' should be parentFeeReceipt
                    # @answer : Fixed
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

                    # Code Review
                    # 'populaing' - Spelling is wrong
                    # If commenting for multiple lines of code then comment above the line not in front of the line.
                    # @answer : Fixed
                    ## populating parentFeeReceipt ##
                    for subFeeReceipt in feeDetailsList:
                        subFeeReceipt['parentFeeReceipt'] = newFeeReceipt.id
                    create_list(feeDetailsList, SubFeeReceiptModelSerializer, activeSchoolID, [activeStudentID])


# Code Review
# 1. Is it okay to have two different functions with same name in the same file? Have you run it to make sure that
# they will not clash.
# @answer : I am not sure, I have changes it anyway.
# 2. Comment here why this function is implemented.
# 3. Based on the comment we can also change the name of this function.
# @answer : For handling refund in case a order fails
@receiver(pre_save, sender=Order)
def FeeAmountRefundHandler(sender, instance, **kwargs):
    if (not instance._state.adding) and instance.status == 'Refund Pending':
        preSavedOrder = Order.objects.get(orderId=instance.orderId)

        # Code Review
        # In a post save signal how can the status of preSavedOrder and current instance be different
        # @answer : It was a mistake, I have changes the signal to pre_save and made changes accordingly
        if preSavedOrder.status == 'Pending':  # if status changed from 'Pending' to 'Refund Pending'

            onlinePaymentTransactionList = OnlineFeePaymentTransaction.objects.filter(parentOrder=preSavedOrder)
            if len(onlinePaymentTransactionList) == 0:  # No attached OnlineFeePaymentTransaction row, Order is made for some other purpose
                return

            onlinePaymentAccount = OnlinePaymentAccount.objects.get(parentSchool=onlinePaymentTransactionList[0].parentSchool)

            # Code Review
            # Why are we mentioning amount that needs to be refunded?
            # Will it not be already mentioned in the cashfree order?
            # @answer : Refund can be partial, it is compulsory to provide refund amount
            # What happens if we mention an amount greater than the original order amount?
            # @answer : Refund will fail
            # If cashfree charges a refund fee from whom will it be charged, will it be deducted from the
            # amount getting refunded or will it be charged from us separately.
            # @answer : I could not find any information about refund fee.
            splitDetails = [
                {
                    "merchantVendorId": onlinePaymentAccount.vendorId,
                    "amount": instance.amount,
                }
            ]

            response = initiateRefund(instance.orderId, splitDetails)
            instance.refundId = response['refundId']
            instance.status = 'Refund Initiated'
