from django.conf.urls import url

urlpatterns = []

######## SMS Delivery Report ###############
from .views import handle_sms_delivery_report_view, handle_msg_club_delivery_report_view

urlpatterns += [
    url(r'^handle-sms-delivery-report', handle_sms_delivery_report_view),
    url(r'^handle-msg-club-delivery-report', handle_msg_club_delivery_report_view),
]
