from django.db import models
from django.db.models.fields import DateField
from school_app.model.models import School
from django.utils.timezone import make_aware, make_naive
from django.contrib.auth import get_user_model
from common.common import BasePermission
from django.core.validators import MaxValueValidator, MinValueValidator


class SchoolMerchantAccount(models.Model):
    platformFeeTypes = (
        ("Percentage", "Percentage"),   # School wishes to pay a percentage of the total platform fee
        ("Flat", "Flat")                # School has a maximum amount of platform fee that it is willing to pay
    )
    parentSchool = models.ForeignKey(School, unique=True, on_delete=models.CASCADE, related_name='SchoolMerchantAccountList')
    vendorId = models.CharField(max_length=20, unique=True)
    easebuzzBankLabel = models.CharField(max_length=50, default="", blank=True)
    isEnabled = models.BooleanField(default=True)
    platformFeeOnSchoolType = models.CharField(max_length=15, choices=platformFeeTypes, default="Percentage")
    percentageOfPlatformFeeOnSchool = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    maxPlatformFeeOnSchool = models.PositiveIntegerField(default=0)

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']

    def __str__(self):
        return '{0} - {1}'.format(self.parentSchool.id, self.parentSchool.name)


class SchoolBankAccountUpdationPermissionCount(models.Model):
    parentSchool = models.ForeignKey(School, unique=True, on_delete=models.CASCADE, related_name='SchoolBankAccountUpdationPermissionList')
    bankAccountUpdationPermissionCount = models.IntegerField(default=0)

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']

    def __str__(self):
        return '{0} ({1}) - {2}'.format(self.parentSchool.name, self.parentSchool.id, self.bankAccountUpdationPermissionCount)


class Order(models.Model):
    TransactionStatus = (
        ('Pending', 'Pending'),                     # just after an order is placed and cashfree has not confirmed the payment
        ('Completed', 'Completed'),                 # cashfree has confirmed the payment
        ('Failed', 'Failed'),                       # Payment has failed and payment cannot be made on that order any longer (Implemented in Cashfree Refund Job)
        # It is a temporary state which is used just for signalling the refund initiation, django signals check if status changes from pending to refund pending and tries to process the refund
        ('Refund Pending', 'Refund Pending'),
        ('Refund Initiated', 'Refund Initiated'),   # Just after Refund has been initiated but cashfree has not confirmed the refund
        ('Refunded', 'Refunded'),                   # cashfree has confirmed the refund
    )
    orderId = models.CharField(max_length=20, unique=True, primary_key=True)
    parentUser = models.ForeignKey(get_user_model(), on_delete=models.PROTECT)
    amount = models.PositiveIntegerField()
    status = models.CharField(max_length=30, choices=TransactionStatus, default='Pending')
    referenceId = models.CharField(max_length=30, null=True, blank=True)
    refundId = models.PositiveBigIntegerField(null=True, blank=True)
    dateTime = models.DateTimeField(auto_now_add=True)

    class Permissions(BasePermission):
        pass

    def __str__(self):
        ## make_naive: removed timezone info from datetime; make_aware: makes datetime aware of time zone, uses timezone from django settings ##
        return self.status + ' | ' + self.orderId + ' | ' + make_aware(make_naive(self.dateTime)).strftime("%d/%m/%Y, %H:%M:%S")


class CashfreeDailyJobsReport(models.Model):

    STATUS_CHOICES = (
        ('INITIATED', 'INITIATED'),
        ('SUCCESS', 'SUCCESS'),
    )

    date = DateField(auto_now_add=True, unique=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='INITIATED', blank=True)

    def __str__(self):
        return '{0} : {1}'.format(self.date.strftime("%d-%m-%Y"), self.status)


class PaymentGateway(models.Model):

    name = models.CharField(max_length=50,null=False)

    class Permissions(BasePermission):
        pass

    def __str__(self):
        return '{0}'.format(self.name)


class ModeOfPayment(models.Model):

    name = models.CharField(max_length=50,null=False)
    parentPaymentGateway = models.ForeignKey(PaymentGateway, null=False, on_delete=models.CASCADE)
    apiCode = models.CharField(max_length=20,null=False)
    enabled = models.BooleanField(default=True)

    class Permissions(BasePermission):
        pass

    def __str__(self):
        return '{0} - {1}'.format(self.parentPaymentGateway.name, self.name)


class ModeOfPaymentCharges(models.Model):

    CHARGE_TYPE_CHOICES = (
        ('Percentage', 'Percentage'),
        ('Flat', 'Flat'),
    )

    parentModeOfPayment = models.ForeignKey(ModeOfPayment, null=False, on_delete=models.CASCADE)
    chargeType = models.CharField(max_length=30, choices=CHARGE_TYPE_CHOICES, default='Flat', null=False)
    charge = models.DecimalField(default=0, null=False, decimal_places=3, max_digits=6)
    minimumAmount = models.IntegerField(default=0)
    maximumAmount = models.IntegerField(default=-1) # -1 when there is no upper limit

    class Permissions(BasePermission):
        pass

    def __str__(self):

        displayString = '{0} - {1}'.format(self.parentModeOfPayment.parentPaymentGateway.name, self.parentModeOfPayment.name)

        if self.chargeType == 'Percentage':
            displayString += ' - '+self.charge+'%'
        elif self.chargeType == 'Flat':
            displayString += self.charge

        if self.minimumAmount != 0:
            displayString += ' - >'+self.minimumAmount
        
        if self.maximumAmount != -1:
            displayString += ' - <'+self.maximumAmount

        return displayString

