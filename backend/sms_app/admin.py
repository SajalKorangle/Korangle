from django.contrib import admin

# Register your models here.

from sms_app.models import SMSPurchase, SMS, SMSDeliveryReport, SMSId

admin.site.register(SMSPurchase)
admin.site.register(SMSDeliveryReport)


@admin.register(SMS)
class SMSAdmin(admin.ModelAdmin):
    search_fields = ('parentSchool__id', 'requestId')
    list_display = ('School_Name', 'KID', 'Content', 'requestId', 'Sent_Status', 'Remark')
    list_filter = ('sentStatus',)

    def School_Name(self, obj):
        return str(obj.parentSchool.name)

    def KID(self, obj):
        return str(obj.parentSchool.id)

    def Content(self, obj):
        return str(obj.content)

    def requestId(self, obj):
        return str(obj.requestId)

    def Sent_Status(self, obj):
        return str(obj.sentStatus)

    def Remark(self, obj):
        return str(obj.remark)


@admin.register(SMSId)
class SmsIdAdmin(admin.ModelAdmin):
    search_fields = ('entityName', 'smsId')
    list_display = ('Entity_Name', 'SMS_ID', 'Status')
    list_filter = ('smsIdStatus',)

    def Entity_Name(self, obj):
        return str(obj.entityName)

    def SMS_ID(self, obj):
        return str(obj.smsId)

    def Status(self, obj):
        return str(obj.smsIdStatus)