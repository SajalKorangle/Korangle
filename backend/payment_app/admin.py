from django.contrib import admin
from .models import Order


class OrderAdminTabular(admin.ModelAdmin):
    model = Order
    list_display = ('orderId', 'status', 'dateTime')
    list_filter = ('status', 'dateTime')

admin.site.register(Order, OrderAdminTabular)
