from django.db import models
from payment_app.cashfree.cashfree import initiateRefund

# Other Model importing Starts

from school_app.model.models import School
from payment_app.models import Order

# Other Model importing Ends

from common.common import BasePermission

from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.db import transaction as db_transaction
from datetime import datetime


# Create your models here.


# At first bills will only be added manually. It will not contain the payment information of sms or anything else.
class Bill(models.Model):

    parentSchool = models.ForeignKey(School, related_name='schoolList', on_delete=models.CASCADE) # Bill will be paid by this school.
    amount = models.PositiveIntegerField(default=1) # Amount which needs to be paid.

    # When was the bill added through django admin panel.
    generationDateTime = models.DateTimeField(auto_now_add=True)

    # Official Bill Date for clients
    billDate = models.DateField(default=datetime.now)

    # What is the bill for?
    towards = models.TextField(default='-')

    # At what interval (in days) from bill date the page header warning should be shown
    pageHeaderWarningInterval = models.IntegerField(null=True, default=0)

    # At what interval (in days) from bill date the modal warning should be shown
    modalWarningInterval = models.IntegerField(null=True, default=15)

    # At What interval (in days) from bill date the software functionalities should be blocked
    functionalityBlockedInterval = models.IntegerField(null=True, default=30)

    # For some reason a bill is cancelled, but you still want to keep the data.
    cancelledDate = models.DateField(null=True, blank=True)

    # To keep the record when the bill was paid.
    # Can be updated by software or manually both.
    paidDate = models.DateTimeField(null=True, blank=True)

    # To keep the pdf of bill
    billPDF = models.FileField(null=True, blank=True)

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool_id']
        RelationsToStudent = []

    class Meta:
        db_table = 'bill'


class BillOrder(models.Model):

    parentBill = models.ForeignKey(Bill, default=0, on_delete=models.SET_NULL, null=True, related_name='billOrderList')
    parentOrder = models.ForeignKey(Order, default=0, on_delete=models.SET_NULL, null=True, related_name='billOrderList')

    class Permissions(BasePermission):
        RelationsToSchool = ['parentBill__parentSchool_id']
        RelationsToStudent = []

    class Meta:
        db_table = 'BillOrder'


@receiver(pre_save, sender=Order)
def BillOrderCompletionHandler(sender, instance, **kwargs):
    if not instance._state.adding and instance.status == 'Completed':
        preSavedOrder = Order.objects.get(orderId=instance.orderId)
        if preSavedOrder.status == 'Pending':  # if status changed from 'Pending' to 'Completed'
            try:
                billOrder = BillOrder.objects.get(parentOrder=preSavedOrder)
                bill = Bill.objects.get(id=billOrder.parentBill_id)
                bill.paidDate = datetime.now()
                bill.save()
            except:  # Order was not for Bill Payment
                return


''' There is no refund method (through api) given by ease buzz
@receiver(pre_save, sender=Order)
def SMSRefundHandler(sender, instance, **kwargs):
    if (not instance._state.adding) and instance.status == 'Refund Pending':

        preSavedOrder = Order.objects.get(orderId=instance.orderId)
        if preSavedOrder.status == 'Pending':  # if status changed from 'Pending' to 'Refund Pending'

            try:
                billOrder = BillOrder.objects.get(parentOrder=preSavedOrder)
            except:  # Order was not for SMS
                return

            # 2nd argument is split, empty split means amount will be deducted from korangle not from other vendor account(school)
            response = initiateRefund(instance.orderId, [], instance.amount)
            instance.refundId = response['refundId']
            instance.status = 'Refund Initiated'
'''

