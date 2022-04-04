from django.db import models
from django.contrib.auth import get_user_model
from common.common import BasePermission

User = get_user_model()

# Create your models here.
class OTP(models.Model):
    mobileNumber = models.BigIntegerField(null=False)
    otp = models.IntegerField(null=False)
    generationDateTime = models.DateTimeField(null=False, auto_now_add=True, verbose_name='generationDateTime')
    ACTION = (
        ( 'SIGN UP', 'SIGN UP' ),
        ( 'FORGOT PASSWORD', 'FORGOT PASSWORD' ),
        ( 'CREATE SCHOOL', 'CREATE SCHOOL' )
    )
    action = models.CharField(max_length=20, choices=ACTION, null=True)

# Model for Device logins
class DeviceList(models.Model):
    token = models.TextField(null=True, verbose_name='token')
    last_active = models.DateTimeField(auto_now_add=True, blank=True, verbose_name='last active')
    login_date = models.DateTimeField(auto_now_add=True, blank=True, verbose_name='login date')
    parentUser = models.ForeignKey(User, on_delete=models.CASCADE)
    device_name = models.TextField(null=True, verbose_name='device name')
    mobile = models.BigIntegerField(null=False, default=0)

    class Permissions(BasePermission):
        RelationsToUser = ['parentUser__id']

    class Meta:
        db_table = 'device_list'