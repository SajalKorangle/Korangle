from django.contrib import admin

# Register your models here.

from expense_app.models import Expense

admin.site.register(Expense)
