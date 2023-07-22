from django.contrib import admin
from bill_app.models import Bill, BillOrder

#admin.site.register(Bill)
admin.site.register(BillOrder)

# Register your models here.

@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = ('parentSchool_id', 'amount')