from django.db import models

from school_app.model.models import School

# Create your models here.


class SMS(models.Model):

    # Content
    content = models.TextField(null=False, default='', verbose_name='content')

    # Sent Date & Time
    sentDateTime = models.DateTimeField(null=False, auto_now_add=True, verbose_name='sentDateTime')

    # Estimated Count
    estimatedCount = models.IntegerField(null=False, default=0, verbose_name='estimatedCount')

    # Count
    count = models.IntegerField(null=False, default=0, verbose_name='count')

    # Mobile Number List
    mobileNumberList = models.TextField(null=False, default='', verbose_name='mobileNumberList')

    # School
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0, verbose_name='parentSchool')

    class Meta:
        db_table = 'sms'


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
        return self.parentSchool.name + ' -- ' + str(self.numberOfSMS) + ' -- ' + str(self.price)

    class Meta:
        db_table = 'sms_purchase'
