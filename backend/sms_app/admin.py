from django.contrib import admin

# Register your models here.

from sms_app.models import SMSPurchase, SMS, MsgClubDeliveryReport, SMSId, SMSTemplate

admin.site.register(SMSPurchase)
admin.site.register(MsgClubDeliveryReport)


@admin.register(SMS)
class SMSAdmin(admin.ModelAdmin):
    search_fields = ('parentSchool__id', 'requestId')
    list_display = ('Sent_By_KID', 'Content', 'requestId', 'Sent_Status', 'Remark')
    list_filter = ('sentStatus',)

    def Sent_By_KID(self, obj):
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


@admin.register(SMSTemplate)
class SmsTemplateAdmin(admin.ModelAdmin):
    search_fields = ('parentSMSId__entityName', 'parentSMSId__smsId')
    list_display = ('Entity_Name', 'SMS_ID', 'Template_Name', 'Template_Status')
    list_filter = ('registrationStatus',)

    def Entity_Name(self, obj):
        return str(obj.parentSMSId.entityName)

    def SMS_ID(self, obj):
        return str(obj.parentSMSId.smsId)

    def Template_Name(self, obj):
        return str(obj.templateName)

    def Template_Status(self, obj):
        return str(obj.registrationStatus)
