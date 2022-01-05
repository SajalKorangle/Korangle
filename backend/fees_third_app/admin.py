from django.contrib import admin
from django.db.models.base import Model
from .models import FeeReceiptOrder
# Register your models here.


class FeeReceiptOrderAdmin(admin.ModelAdmin):
    Model = FeeReceiptOrder
    readonly_fields = [field.name for field in FeeReceiptOrder._meta.concrete_fields]


admin.site.register(FeeReceiptOrder, FeeReceiptOrderAdmin)
