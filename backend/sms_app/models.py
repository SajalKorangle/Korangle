import json
from django.db import models
from django.db import transaction as db_transaction

from school_app.model.models import School
from information_app.models import MessageType
from payment_app.models import Order


from django.dispatch import receiver
from django.db.models.signals import pre_save
from common.common_serializer_interface_3 import create_object


# Create your models here.
class SMS(models.Model):

    parentMessageType = models.ForeignKey(MessageType, on_delete=models.PROTECT, default=1)

    # Content Type
    contentType = models.TextField(null=False, default='', verbose_name='contentType')

    # Content
    content = models.TextField(null=False, default='', verbose_name='content')

    # Sent Date & Time
    sentDateTime = models.DateTimeField(null=False, auto_now_add=True, verbose_name='sentDateTime')

    # Estimated Count
    # estimatedCount = models.IntegerField(null=False, default=0, verbose_name='estimatedCount')

    # Count
    count = models.IntegerField(null=False, default=0, verbose_name='count')

    # Notification Count
    notificationCount = models.IntegerField(null=False, default=0, verbose_name='notificationCount')

    # Mobile Number List
    mobileNumberList = models.TextField(null=False, blank=True, default='', verbose_name='mobileNumberList')

    # Notification Mobile Number List
    notificationMobileNumberList = models.TextField(null=False, blank=True, default='', verbose_name='notificationMobileNumberList')

    # Request Id
    requestId = models.TextField(null=True, verbose_name='requestId')

    # School
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0, verbose_name='parentSchool')

    def __str__(self):
        return str(self.parentSchool.pk) + ' - ' + self.parentSchool.name + ' --- ' + str(self.count)

    class Meta:
        db_table = 'sms'


class MsgClubDeliveryReport(models.Model):

    # Request Id
    requestId = models.TextField(null=False, verbose_name='requestId')

    # Mobile Number
    mobileNumber = models.IntegerField(null=False, verbose_name='mobileNumber')

    # Status
    status = models.TextField(null=False, verbose_name='status')

    # Status Code
    statusCode = models.TextField(null=False, verbose_name='statusCode')

    # Delivered Date & Time
    deliveredDateTime = models.DateTimeField(null=True, verbose_name='deliveredDateTime')

    # Sender Id
    senderId = models.CharField(null=False, max_length=10, default='KORNGL', verbose_name='senderId')

    def __str__(self):
        return self.requestId

    class Meta:
        db_table = 'msg_club_delivery_report'
        unique_together = ('requestId', 'mobileNumber')


class SMSPurchase(models.Model):

    # SMS No.
    numberOfSMS = models.IntegerField(null=False, default=0, verbose_name='numberOfSMS')

    # Price
    price = models.IntegerField(null=False, default=0, verbose_name='price')

    # Purchase Date & Time
    purchaseDateTime = models.DateTimeField(null=False, auto_now_add=True, verbose_name='purchaseDateTime')

    # School
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0, verbose_name='parentSchool')


    def __str__(self):
        return str(self.parentSchool.pk) + ' - ' + self.parentSchool.name + ' -- ' + str(self.numberOfSMS) + ' -- ' + str(self.price)

    class Meta:
        db_table = 'sms_purchase'


class OnlineSmsPaymentTransaction(models.Model):
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT)
    parentOrder = models.ForeignKey(Order, on_delete=models.PROTECT, unique=True)
    smsPurchaseJSON = models.TextField()
    parentSmsPurchase = models.ForeignKey(SMSPurchase, on_delete=models.PROTECT, null=True, blank=True)


from .views import SMSPurchaseView
SMSPurchaseModelSerializer = SMSPurchaseView().ModelSerializer

@receiver(pre_save, sender=Order)
def SMSOrderCompletionhandler(sender, instance, **kwargs):
    if not instance._state.adding and instance.status == 'Completed':
        preSavedOrder = Order.objects.get(orderId=instance.orderId)
        if preSavedOrder.status=='Pending': # if status changed from 'Pending' to 'Completed'
            try:
                onlineSmsPaymentTransaction = OnlineSmsPaymentTransaction.objects.get(parentOrder = preSavedOrder)
            except: # Order was not mabe for SMS
                return
            activeSchoolID = onlineSmsPaymentTransaction.parentSchool.id
            smsPurchaseData = json.loads(onlineSmsPaymentTransaction.smsPurchaseJSON)
            with db_transaction.atomic():
                response = create_object(smsPurchaseData, SMSPurchaseModelSerializer, activeSchoolID, None)
                smsPurchase = SMSPurchase.objects.get(id=response['id'])
                onlineSmsPaymentTransaction.parentSmsPurchase = smsPurchase
                onlineSmsPaymentTransaction.save()
                
            

