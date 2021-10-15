from django.contrib import admin
from .models import Order, SchoolMerchantAccount, CashfreeDailyJobsReport


class OrderAdminTabular(admin.ModelAdmin):
    model = Order
    list_display = ('orderId', 'status', 'dateTime')
    list_filter = ('status', 'dateTime')
    readonly_fields = [field.name for field in Order._meta.concrete_fields if field.name != 'status']


class SchoolMerchantAccountAdminTabular(admin.ModelAdmin):
    list_display = ('parentSchool', 'vendorId')
    readonly_fields = [field.name for field in SchoolMerchantAccount._meta.concrete_fields]


admin.site.register(Order, OrderAdminTabular)
admin.site.register(SchoolMerchantAccount, SchoolMerchantAccountAdminTabular)
admin.site.register(CashfreeDailyJobsReport)
