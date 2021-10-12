from django.contrib import admin
from .models import Order, SchoolMerchantAccount, CashfreeDailyJobsReport


class OrderAdminTabular(admin.ModelAdmin):
    model = Order
    list_display = ('id', 'status', 'dateTime')
    list_filter = ('status', 'dateTime')


admin.site.register(Order, OrderAdminTabular)
admin.site.register(SchoolMerchantAccount)
admin.site.register(CashfreeDailyJobsReport)
