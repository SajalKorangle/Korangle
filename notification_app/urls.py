
from django.conf.urls import url

urlpatterns = []

from notification_app.views import GCMDeviceView, GCMDeviceListView

urlpatterns += [
    url(r'^gcm-devices/batch', GCMDeviceListView.as_view()),
    url(r'^gcm-devices', GCMDeviceView.as_view()),
]


