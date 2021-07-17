from django.contrib import admin
from django.conf.urls import include, url

from django.contrib.admin.views.decorators import staff_member_required
from django.http import HttpResponseRedirect


class NotificationAdmin(admin.ModelAdmin):
    change_list = 'change_list.html'


# Register your models here.
from notification_app.models import Notification

admin.site.register(Notification)
