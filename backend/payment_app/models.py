from django.db import models
from django.db.models.fields import DateField
from school_app.model.models import School
from django.utils.timezone import make_aware, make_naive
from django.contrib.auth import get_user_model


class SchoolMerchantAccount(models.Model):
    parentSchool = models.ForeignKey(School, unique=True, on_delete=models.CASCADE)
    vendorId = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return '{0} - {1}'.format(self.parentSchool.id, self.parentSchool.name)


class Order(models.Model):
    TransactionStatus = (
        ('Pending', 'Pending'),                     # just after an order is placed and cashfree has not confirmed the payment
        ('Completed', 'Completed'),                 # cashfree has confirmed the payment
        ('Failed', 'Failed'),                       # Payment has failed and payment cannot be made on that order any longer
        # It is a temporary state which is used just for signalling the refund initiation, django signals check if status changes from pending to refund pending and tries to process the refund
        ('Refund Pending', 'Refund Pending'),
        ('Refund Initiated', 'Refund Initiated'),   # Just after Refund has been initiated but cashfree has not confirmed the refund
        ('Refunded', 'Refunded'),                   # cashfree has confirmed the refund
    )
    id = models.CharField(max_length=20, unique=True, primary_key=True)
    parentUser = models.ForeignKey(get_user_model(), on_delete=models.PROTECT)
    amount = models.PositiveIntegerField()
    status = models.CharField(max_length=30, choices=TransactionStatus, default='Pending')
    referenceId = models.CharField(max_length=30, null=True, blank=True)
    refundId = models.PositiveBigIntegerField(null=True, blank=True)
    dateTime = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        ## make_naive: removed timezone info from datetime; make_aware: makes datetime aware of time zone, uses timezone from django settings ##
        return self.status + ' | ' + self.id + ' | ' + make_aware(make_naive(self.dateTime)).strftime("%d/%m/%Y, %H:%M:%S")


class CashfreeDailyJobsReport(models.Model):

    STATUS_CHOICES = (
        ('INITIATED', 'INITIATED'),
        ('SUCCESS', 'SUCCESS'),
    )

    date = DateField(auto_now_add=True, unique=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='INITIATED', blank=True)

    def __str__(self):
        return '{0} : {1}'.format(self.date.strftime("%d-%m-%Y"), self.status)
