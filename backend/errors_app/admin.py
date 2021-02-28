from django.contrib import admin
from .models import Error

class ErrorAdmin(admin.ModelAdmin):
    readonly_fields = ('dateTime',)

admin.site.register(Error, ErrorAdmin)
