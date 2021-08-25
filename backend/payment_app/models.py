from django.db import models
from django.db.models.fields import DateField
from school_app.model.models import School
from django.utils.timezone import make_aware, make_naive


# Code Review
# Would it more understandable if we change this name to SchoolMerchantId or SchoolVendorId ? (Point No. 22 from code practice file)
class OnlinePaymentAccount(models.Model):
    parentSchool = models.ForeignKey(School, unique=True, on_delete=models.CASCADE)
    vendorId = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return '{0} - {1}'.format(self.parentSchool.id, self.parentSchool.name)


class Order(models.Model):
    # Code Review
    # Please comment at least one scenario for below transaction status to be possible.
    TransactionStatus = (
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed'),
        ('Refund Pending', 'Refund Pending'),
        ('Refund Initiated', 'Refund Initiated'),
        ('Refunded', 'Refunded'),
    )
    orderId = models.CharField(max_length=20, unique=True, primary_key=True)
    amount = models.PositiveIntegerField()
    status = models.CharField(max_length=30, choices=TransactionStatus, default='Pending')
    referenceId = models.CharField(max_length=30, null=True, blank=True)
    refundId = models.PositiveBigIntegerField(null=True, blank=True)
    dateTime = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.status+ ' | ' + self.orderId + ' | ' + make_aware(make_naive(self.dateTime)).strftime("%d/%m/%Y, %H:%M:%S")


class DailyJobsReport(models.Model):

    STATUS_CHOICES = (
        ('INITIATED', 'INITIATED'),
        ('SUCCESS', 'SUCCESS'),
    )

    date = DateField(auto_now_add=True, unique=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='INITIATED', blank=True)

    def __str__(self):
        return '{0} : {1}'.format(self.date.strftime("%d-%m-%Y"), self.status)
