from django.contrib import admin
from .models import Error
from django.utils.safestring import mark_safe
from django.core import urlresolvers

class ErrorAdmin(admin.ModelAdmin):

    def get_readonly_fields(self, request, obj=None):
        return [f.name for f in self.model._meta.fields]+['user_link']
    
    def user_link(self, obj):
        change_url = urlresolvers.reverse('admin:auth_user_change', args=(obj.user.id,))
        return mark_safe('<a href="%s">%s</a>' % (change_url, obj.user.username))

admin.site.register(Error, ErrorAdmin)
