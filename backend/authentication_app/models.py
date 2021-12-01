from django.db import models

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

