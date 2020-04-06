from django.contrib import admin

# Register your models here.

from sms_app.models import SMSPurchase, SMS, MsgClubDeliveryReport


admin.site.register(SMSPurchase)
admin.site.register(SMS)
admin.site.register(MsgClubDeliveryReport)
