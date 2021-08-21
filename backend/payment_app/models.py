from django.db import models
from school_app.model.models import School
from django.utils.timezone import make_aware, make_naive



class OnlinePaymentAccount(models.Model):
    parentSchool = models.ForeignKey(School, unique=True, on_delete=models.CASCADE)
    vendorId = models.CharField(max_length=20, unique=True)


class Order(models.Model):
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
