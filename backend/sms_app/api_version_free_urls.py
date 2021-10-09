from django.conf.urls import url

urlpatterns = []

######## SMS Delivery Report ###############
from .views import handle_sms_delivery_report_view

urlpatterns += [
    url(r'^handle-sms-delivery-report', handle_sms_delivery_report_view),
]
