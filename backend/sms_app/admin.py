from django.contrib import admin

# Register your models here.

from sms_app.models import SMSPurchase, SMS, MsgClubDeliveryReport, SenderId, SMSTemplate

admin.site.register(SMSPurchase)
admin.site.register(SMS)
admin.site.register(MsgClubDeliveryReport)

@admin.register(SenderId)
class SmsIdAdmin(admin.ModelAdmin):
    search_fields = ('parentSchool__printName', 'parentSchool__id')
    list_display = ('School_Name', 'SMS_ID', 'Status')
    list_filter = ('senderIdStatus',)

    def School_Name(self,obj):
        return str(obj.parentSchool.id) + ' - ' + obj.parentSchool.printName

    def SMS_ID(self, obj):
        return str(obj.senderId)

    def Status(self, obj):
        return str(obj.senderIdStatus)


@admin.register(SMSTemplate)
class SmsIdAdmin(admin.ModelAdmin):
    search_fields = ('parentSenderId__parentSchool__printName', 'parentSchool__id', 'parentSenderId')
    list_display = ('School_Name', 'SMS_ID', 'Template_Name', 'Template_Status')
    list_filter = ('registrationStatus',)

    def School_Name(self,obj):
        return str(obj.parentSenderId.parentSchool.id) + ' - ' + obj.parentSenderId.parentSchool.printName

    def SMS_ID(self, obj):
        return str(obj.parentSenderId.senderId)

    def Template_Name(self, obj):
        return str(obj.templateName)

    def Template_Status(self, obj):
        return str(obj.registrationStatus)
