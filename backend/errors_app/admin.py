from django.contrib import admin
from .models import Error

class ErrorAdmin(admin.ModelAdmin):

    def get_readonly_fields(self, request, obj=None):
        return [f.name for f in self.model._meta.fields]

admin.site.register(Error, ErrorAdmin)
