from django.conf.urls import url

urlpatterns = []


######## SMS Purchase ###############
from .views import SMSPurchaseView

urlpatterns += [
	url(r'^school/(?P<school_id>[0-9]+)/sms-purchases', SMSPurchaseView.as_view()),
]


######## SMS Old ###############
from .views import SMSOldListView

urlpatterns += [
	url(r'^school/(?P<school_id>[0-9]+)/sms$', SMSOldListView.as_view()),
]


######## SMS Count ###############
from .views import SMSCountView

urlpatterns += [
	url(r'^school/(?P<school_id>[0-9]+)/sms-count', SMSCountView.as_view()),
]


######## Send SMS ###############
from .views import SendSMSView

urlpatterns += [
	url(r'^send-sms', SendSMSView.as_view()),
]

######## Msg Club Delivery Report ###############
from .views import MsgClubDeliveryReportView, handle_msg_club_delivery_report_view

urlpatterns += [
	url(r'^handle-msg-club-delivery-report', handle_msg_club_delivery_report_view),
	url(r'^msg-club-delivery-report', MsgClubDeliveryReportView.as_view()),
]


######## SMS ##############
from .views import SmsView, SmsListView

urlpatterns += [
	url(r'^sms/batch', SmsListView.as_view()),
	url(r'^sms', SmsView.as_view()),
]

######### Send Different SMS ############
from .views import SmsDifferentView

urlpatterns += [
	url(r'^send-diff-sms', SmsDifferentView.as_view()),
]
