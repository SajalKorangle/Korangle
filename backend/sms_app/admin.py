from django.contrib import admin

# Register your models here.

from sms_app.models import SMSPurchase, SMS, MsgClubDeliveryReport, SMSId, SMSTemplate

admin.site.register(SMSPurchase)
admin.site.register(SMS)
admin.site.register(MsgClubDeliveryReport)

@admin.register(SMSId)
class SmsIdAdmin(admin.ModelAdmin):
    search_fields = ('parentSchool__printName', 'parentSchool__id')
    list_display = ('School_Name', 'SMS_ID', 'Status')
    list_filter = ('smsIdStatus',)

    def School_Name(self,obj):
        return str(obj.parentSchool.id) + ' - ' + obj.parentSchool.printName

    def SMS_ID(self, obj):
        return str(obj.smsId)

    def Status(self, obj):
        return str(obj.smsIdStatus)


@admin.register(SMSTemplate)
class SmsIdAdmin(admin.ModelAdmin):
    search_fields = ('parentSchool__printName', 'parentSchool__id', 'parentSMSId')
    list_display = ('School_Name', 'SMS_ID', 'Template_Name', 'Template_Status')
    list_filter = ('registrationStatus',)

    def School_Name(self,obj):
        return str(obj.parentSchool.id) + ' - ' + obj.parentSchool.printName

    def SMS_ID(self, obj):
        return str(obj.parentSMSId.smsId)

    def Template_Name(self, obj):
        return str(obj.smsTemplateName)

    def Template_Status(self, obj):
        return str(obj.registrationStatus)
