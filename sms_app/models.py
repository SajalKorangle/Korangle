from django.db import models

from school_app.model.models import School

# Create your models here.

MESSAGE_TYPE = (
    ('Custom', 'Custom'),
    ('Defaulter', 'Defaulter'),
    ('Attendance', 'Attendance'),
    ('Fees', 'Fees'),
    ('Examination', 'Examination')
)


class SMS(models.Model):

    message_type = models.CharField(max_length=15, choices=MESSAGE_TYPE, default='CST')

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
