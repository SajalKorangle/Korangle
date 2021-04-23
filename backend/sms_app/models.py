from django.db import models
from django.db.models.signals import post_save, pre_save

from school_app.model.models import School
from information_app.models import MessageType, SentUpdateType


# Create your models here.
from sms_app.signals import sms_sender


class SMSEvent(models.Model):
    eventName = models.TextField(max_length=50, null=False, verbose_name='eventName')
    defaultSMSContent = models.TextField(null=False, verbose_name='defaultSMSContent')
    defaultNotificationContent = models.TextField(null=False, verbose_name='defaultNotificationContent')

    class Meta:
        db_table = 'sms_event'


class SMS(models.Model):
    parentMessageType = models.ForeignKey(MessageType, on_delete=models.PROTECT, default=1)

    parentSMSEvent = models.ForeignKey(SMSEvent, on_delete=models.PROTECT, null=True)

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
    notificationMobileNumberList = models.TextField(null=False, blank=True, default='',
                                                    verbose_name='notificationMobileNumberList')

    # Request Id
    requestId = models.TextField(null=True, verbose_name='requestId')

    # School
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0, verbose_name='parentSchool')

    def __str__(self):
        return str(self.parentSchool.pk) + ' - ' + self.parentSchool.name + ' --- ' + str(self.count)

    class Meta:
        db_table = 'sms'


pre_save.connect(sms_sender, sender=SMS)

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
        return str(self.parentSchool.pk) + ' - ' + self.parentSchool.name + ' -- ' + str(
            self.numberOfSMS) + ' -- ' + str(self.price)

    class Meta:
        db_table = 'sms_purchase'


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

    class Meta:
        db_table = 'sms_id'


class SMSIdSchool(models.Model):
    parentSMSId = models.ForeignKey(SMSId, on_delete=models.CASCADE, default=0, verbose_name='parentSMSId')
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, null=False, verbose_name='parentSchool')

    class Meta:
        db_table = 'smsid_school'


class SMSTemplate(models.Model):
    parentSMSId = models.ForeignKey(SMSId, on_delete=models.CASCADE, default=0, verbose_name='parentSenderId')
    createdDate = models.DateField(null=False, auto_now_add=True, verbose_name='createdDate')

    templateId = models.TextField(null=False, verbose_name='templateId')
    templateName = models.TextField(null=False, verbose_name='templateName')
    rawContent = models.TextField(null=False, verbose_name='rawContent')

    SERVICE_IMPLICIT = 'SERVICE IMPLICIT'
    SERVICE_EXPLICIT = 'SERVICE EXPLICIT'
    PROMOTIONAL = 'PROMOTIONAL'
    SMS_COMMUNICATION_TYPE = (
        (SERVICE_IMPLICIT, 'SERVICE IMPLICIT'),
        (SERVICE_EXPLICIT, 'SERVICE EXPLICIT'),
        (PROMOTIONAL, 'PROMOTIONAL')
    )

    communicationType = models.CharField(max_length=20, choices=SMS_COMMUNICATION_TYPE, null=False,
                                         verbose_name='communicationType')
    mappedContent = models.TextField(null=True, verbose_name='mappedContent')

    APPROVED = 'APPROVED'
    PENDING = 'PENDING'
    STATUS = (
        (APPROVED, 'APPROVED'),
        (PENDING, 'PENDING'),
    )

    registrationStatus = models.CharField(max_length=15, null=False, choices=STATUS, default=PENDING)

    class Meta:
        db_table = 'sms_template'


class SMSEventSettings(models.Model):
    parentSMSEvent = models.ForeignKey(SMSEvent, on_delete=models.CASCADE, null=False, verbose_name='parentSMSEvent')
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, null=False, verbose_name='parentSchool')
    parentSMSTemplate = models.ForeignKey(SMSTemplate, on_delete=models.CASCADE, default=0,
                                          verbose_name='parentSMSTemplate')
    parentSentUpdateType = models.ForeignKey(SentUpdateType, on_delete=models.PROTECT, null=True,
                                             verbose_name='parentSentUpdateType')
    notificationMappedContent = models.TextField(null=True, verbose_name='notificationMappedContent')

    UPDATE_ALL = 'All Students'
    UPDATE_ABSENT = 'Only Absent Students'
    UPDATE_TO_CHOICES = [
        (UPDATE_ALL, 'All Students'),
        (UPDATE_ABSENT, 'Only Absent Students')
    ]

    receiverType = models.CharField(max_length=20, choices=UPDATE_TO_CHOICES, null=True,
                                    verbose_name='receiverType')
