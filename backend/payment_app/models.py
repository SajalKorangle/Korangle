from django.db import models
from school_app.model.models import School


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
    referenceId = models.CharField(max_length=30, null=True, default=None)
    dateTime = models.DateTimeField(auto_now_add=True)
