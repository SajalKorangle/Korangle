from django.db.models.fields import related
from common.common import BasePermission
from payment_app.cashfree.cashfree import initiateRefund
import json
from django.db import models
from django.db import transaction as db_transaction
import traceback

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from school_app.model.models import School
from information_app.models import MessageType
from common.common import BasePermission
from payment_app.models import Order


from django.dispatch import receiver
from django.db.models.signals import pre_save
from generic.generic_serializer_interface import GenericSerializerInterface


# Create your models here

class SMSId(models.Model):
    entityName = models.TextField(null=False, verbose_name='entityName')
    entityRegistrationId = models.TextField(null=False, verbose_name='entityRegistrationId')
    smsId = models.CharField(max_length=10, null=False, verbose_name='smsId')
    smsIdRegistrationNumber = models.TextField(null=True, verbose_name='SMSIdRegistrationNumber')

    ACTIVATED = 'ACTIVATED'
    PENDING = 'PENDING'
    STATUS = (
        (ACTIVATED, 'ACTIVATED'),
        (PENDING, 'PENDING'),
    )

    smsIdStatus = models.CharField(max_length=15, choices=STATUS, null=False, default=PENDING)

    class Permissions(BasePermission):
        RelationsToSchool = []
        RelationsToStudent = []

    class Meta:
        db_table = 'sms_id'
        unique_together = ('smsId', 'entityRegistrationId')


class SMSIdSchool(models.Model):
    parentSMSId = models.ForeignKey(SMSId, on_delete=models.CASCADE, null=False, verbose_name='parentSMSId')
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, null=False, verbose_name='parentSchool')

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']
        RelationsToStudent = []

    class Meta:
        db_table = 'smsid_school'


@receiver(post_delete, sender=SMSIdSchool)
def sms_id_delete_check(sender, instance, **kwargs):
    instance_dict = instance.__dict__
    try:
        sms_id = SMSId.objects.get(id=instance_dict['parentSMSId_id'])
        sms_id_school_sibling_list_length = SMSIdSchool.objects.filter(parentSMSId=sms_id).count()
        
        SMSEventSettings.objects.filter(
            parentSchool=instance_dict['parentSchool_id'],
            parentSMSTemplate__parentSMSId=sms_id
        ).delete()

        if sms_id_school_sibling_list_length == 0:
            print('Parent SMS ID Deleted')
            sms_id.delete()
    except SMSIdSchool.DoesNotExist:
        print('SMS ID not deleted because another school is using it')


class SMSTemplate(models.Model):
    parentSMSId = models.ForeignKey(SMSId, on_delete=models.CASCADE, null=False, verbose_name='parentSenderId')
    createdDate = models.DateField(null=False, auto_now_add=True, verbose_name='createdDate')

    templateId = models.TextField(null=False, verbose_name='templateId')
    templateName = models.TextField(null=False, verbose_name='templateName')
    rawContent = models.TextField(null=False, verbose_name='rawContent')
    mappedContent = models.TextField(null=True, verbose_name='mappedContent', blank=True)

    class Permissions(BasePermission):
        RelationsToSchool = []
        RelationsToStudent = []

    class Meta:
        db_table = 'sms_template'


class SMS(models.Model):
    parentMessageType = models.ForeignKey(MessageType, on_delete=models.PROTECT, default=1, null=True)

    SMSEventId = models.IntegerField(null=False, default=0)

    # Content Type
    contentType = models.TextField(null=False, default='', verbose_name='contentType(DCS)')

    SUCCESS = 'SUCCESS'
    FAILED = 'FAILED'
    PENDING = 'PENDING'
    SENT_STATUS_CHOICES = [
        (SUCCESS, 'SUCCESS'),
        (FAILED, 'FAILED'),
        (PENDING, 'PENDING')
    ]

    sentStatus = models.CharField(max_length=10, choices=SENT_STATUS_CHOICES, default=PENDING, null=True,
                                  verbose_name='sentStatus')

    remark = models.TextField(null=False, default='SUCCESS', verbose_name='remark')

    # Content
    content = models.TextField(null=False, default='', verbose_name='content')

    # content for each Mobile Number
    mobileNumberContentJson = models.TextField(null=False, default='', verbose_name='contentMobileNumberJson')

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
    notificationMobileNumberList = models.TextField(null=False, blank=True, default='',
                                                    verbose_name='notificationMobileNumberList')

    # Request Id
    requestId = models.TextField(null=True, verbose_name='requestId')

    # School
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE, default=0, verbose_name='parentSchool')

    # SMSId
    parentSMSId = models.ForeignKey(SMSId, on_delete=models.SET_NULL, null=True, verbose_name='smsId')

    # SMSTemplate
    parentSMSTemplate = models.ForeignKey(SMSTemplate, on_delete=models.SET_NULL, null=True, verbose_name='smsTemplate')

    # scheduledSMS
    scheduledDateTime = models.DateTimeField(null=True)

    smsGateWayHubVendor = models.BooleanField(null=False, default=False)

    msgClubVendor = models.BooleanField(null=False, default=False)

    # payload
    payload = models.TextField(null=True, verbose_name='payload')

    # response
    response = models.TextField(null=True, verbose_name='payload')

    def __str__(self):
        return str(self.parentSchool.pk) + ' - ' + self.parentSchool.name + ' --- ' + str(self.count)

    class Meta:
        db_table = 'sms'


@receiver(post_save, sender=SMS)
def sms_sender(sender, created, instance, **kwargs):
    if created:
        response = {'remark': 'ONLY NOTIFICATION', 'requestId': None,
                    'mobileNumberContentJson': instance.mobileNumberContentJson, 'payload': None, 'response': None}
        from sms_app.business.send_sms import send_sms_via_smsgatewayhub, send_sms_via_msgclub
        try:
            if instance.count > 0:
                #response = send_sms_via_smsgatewayhub(instance.__dict__)
                #instance.smsGateWayHubVendor = True
                response = send_sms_via_msgclub(instance.__dict__)
                instance.msgClubVendor = True
                # RequestId will become -1 if the sms balance is low
                instance.sentStatus = 'FAILED' if response['requestId'] == -1 else 'SUCCESS'
        except Exception as e:
            traceback.print_exc()
            # Whenever exception occurs in the function we are saving the remark
            # The sent status is by default PENDING so it will remain the same, support team can confirm the sent
            response = {'remark': 'EXCEPTION OCCURRED', 'requestId': -1,
                        'mobileNumberContentJson': instance.mobileNumberContentJson, 'payload': None, 'response': None}

        instance.requestId = response['requestId']
        instance.remark = response['remark']
        instance.mobileNumberContentJson = response['mobileNumberContentJson']
        instance.payload = response['payload']
        instance.response = response['response']
        instance.save()


class SMSDeliveryReport(models.Model):
    # Request Id
    requestId = models.TextField(null=True, verbose_name='requestId')

    # Mobile Number
    mobileNumber = models.BigIntegerField(null=True, verbose_name='mobileNumber')

    # Status
    status = models.TextField(null=False, verbose_name='status')

    # Status Code
    statusCode = models.TextField(null=True, verbose_name='statusCode')

    # Delivered Date & Time
    deliveredDateTime = models.DateTimeField(null=True, verbose_name='deliveredDateTime')

    messageId = models.TextField(null=True, verbose_name='messageId', unique=True)

    # Sender Id
    senderId = models.CharField(null=True, max_length=10, verbose_name='senderId')

    def __str__(self):
        return self.requestId

    class Meta:
        db_table = 'sms_delivery_report'


class SMSPurchase(models.Model):
    # SMS No.
    numberOfSMS = models.IntegerField(null=False, default=0)

    # Price
    price = models.IntegerField(null=False, default=0, verbose_name='price')

    # Purchase Date & Time
    purchaseDateTime = models.DateTimeField(null=False, auto_now_add=True)

    # School
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0, related_name='smsPurchaseList')

    def __str__(self):
        return str(self.parentSchool.pk) + ' - ' + self.parentSchool.name + ' -- ' + str(
            self.numberOfSMS) + ' -- ' + str(self.price)

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']

    class Meta:
        db_table = 'sms_purchase'


class SmsPurchaseOrder(models.Model):
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, related_name='smsPurchaseOrderList')
    parentOrder = models.ForeignKey(Order, on_delete=models.PROTECT, unique=True, related_name='smsPurchaseOrderList')
    smsPurchaseData = models.JSONField()
    parentSmsPurchase = models.ForeignKey(SMSPurchase, on_delete=models.PROTECT, null=True, blank=True, related_name='smsPurchaseOrderList')

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id', 'parentSmsPurchase__parentSchool__id']


@receiver(pre_save, sender=Order)
def SMSOrderCompletionHandler(sender, instance, **kwargs):
    if not instance._state.adding and instance.status == 'Completed':
        preSavedOrder = Order.objects.get(orderId=instance.orderId)
        if preSavedOrder.status == 'Pending':  # if status changed from 'Pending' to 'Completed'
            try:
                onlineSmsPaymentTransaction = SmsPurchaseOrder.objects.get(parentOrder=preSavedOrder)
            except:  # Order was not for SMS
                return
            activeSchoolID = onlineSmsPaymentTransaction.parentSchool.id
            smsPurchaseData = onlineSmsPaymentTransaction.smsPurchaseData
            with db_transaction.atomic():
                response = GenericSerializerInterface(Model=SMSPurchase, data=smsPurchaseData, activeSchoolId=activeSchoolID).create_object()
                smsPurchase = SMSPurchase.objects.get(id=response['id'])
                onlineSmsPaymentTransaction.parentSmsPurchase = smsPurchase
                onlineSmsPaymentTransaction.save()


@receiver(pre_save, sender=Order)
def SMSRefundHandler(sender, instance, **kwargs):
    if (not instance._state.adding) and instance.status == 'Refund Pending':

        preSavedOrder = Order.objects.get(orderId=instance.orderId)
        if preSavedOrder.status == 'Pending':  # if status changed from 'Pending' to 'Refund Pending'

            try:
                onlineSmsPaymentTransaction = SmsPurchaseOrder.objects.get(parentOrder=preSavedOrder)
            except:  # Order was not for SMS
                return

            # 2nd argument is split, empty split means amount will be deducted from korangle not from other vendor account(school)
            response = initiateRefund(instance.orderId, [], instance.amount)
            instance.refundId = response['refundId']
            instance.status = 'Refund Initiated'


class SMSEventSettings(models.Model):
    SMSEventId = models.IntegerField(null=False, default=0)
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, null=False, verbose_name='parentSchool')
    parentSMSTemplate = models.ForeignKey(SMSTemplate, on_delete=models.CASCADE, null=True,
                                          verbose_name='parentSMSTemplate')
    sendUpdateTypeId = models.IntegerField(null=False, default=0)
    customNotificationContent = models.TextField(null=True, verbose_name='customNotificationContent')

    UPDATE_ALL = 'All Students'
    UPDATE_ABSENT = 'Only Absent Students'
    UPDATE_TO_CHOICES = [
        (UPDATE_ALL, 'All Students'),
        (UPDATE_ABSENT, 'Only Absent Students')
    ]

    receiverType = models.CharField(max_length=20, choices=UPDATE_TO_CHOICES, null=True,
                                    verbose_name='receiverType')

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']
        RelationsToStudent = []

    class Meta:
        db_table = 'sms_event_settings'
