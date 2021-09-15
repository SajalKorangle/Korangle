from django.db import models
from django.db.models.fields import DateField
from school_app.model.models import School
from django.utils.timezone import make_aware, make_naive


# Code Review
# Would it more understandable if we change this name
# to SchoolMerchantId or SchoolVendorId ? (Point No. 22 from code practice file)
class OnlinePaymentAccount(models.Model):
    parentSchool = models.ForeignKey(School, unique=True, on_delete=models.CASCADE)
    vendorId = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return '{0} - {1}'.format(self.parentSchool.id, self.parentSchool.name)


class Order(models.Model):
    # Code Review
    # Please comment at least one scenario for below transaction status to be possible.
    # @answer : done
    TransactionStatus = (
        ('Pending', 'Pending'),                     # just after an order is placed and payment have not been done
        ('Completed', 'Completed'),                 # cashfree has confirmed the payment
        ('Failed', 'Failed'),                       # Payment has failed ans payment cannot be made on that order any longer
        # It is a temporary state which is used just for signalling the refund initiation, django signals check if status changes from pending to refund pending ans tries to process the refund
        ('Refund Pending', 'Refund Pending'),
        ('Refund Initiated', 'Refund Initiated'),   # Just after Refund has been initiated
        ('Refunded', 'Refunded'),                   # cashfree has confirmed the refund
    )
    # Code Review
    # We always have kept id as the primary key. Might have hardcoded at a lot of places too.
    # Is it necessary to keep the nomenclature of primary key to be orderId. You can write the comment
    # that id is also sent to cash free for unique identification of order.
    # @answer : yes we can do this
    orderId = models.CharField(max_length=20, unique=True, primary_key=True)
    amount = models.PositiveIntegerField()
    status = models.CharField(max_length=30, choices=TransactionStatus, default='Pending')
    # Code Review
    # If this corresponds to UTR Number, please write a comment about it.
    # @answer : it seems so, but I am not sure
    referenceId = models.CharField(max_length=30, null=True, blank=True)
    refundId = models.PositiveBigIntegerField(null=True, blank=True)
    dateTime = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # Code Review
        # Please comment what does make_aware and make_naive function do
        # @answer : it dosen't seems of much use as these are standard function, anyone can find it on google, I am writting it though
        ## make_naive: removed timezone info from datetime; make_aware: makes datetime aware of time zone, uses timezone from django settings ##
        return self.status + ' | ' + self.orderId + ' | ' + make_aware(make_naive(self.dateTime)).strftime("%d/%m/%Y, %H:%M:%S")


# Code Review
# This model is capable of handling only Cashfree Refund job and not any other thing.
# Please change its name to CashfreeRefundDailyJobReport. If we create job choices and a job field then it can be
# generic and can be shifted to its own app or something. But if we are hoping to keep it here itself for one job,
# we should change model name according to the job.
# @answer : done, since refund is not the only thing that is handled in the job, I am naming it CashfreeDailyJobReport
class CashfreeDailyJobsReport(models.Model):

    STATUS_CHOICES = (
        ('INITIATED', 'INITIATED'),
        ('SUCCESS', 'SUCCESS'),
    )

    date = DateField(auto_now_add=True, unique=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='INITIATED', blank=True)

    def __str__(self):
        return '{0} : {1}'.format(self.date.strftime("%d-%m-%Y"), self.status)
