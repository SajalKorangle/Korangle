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



########  SMS  Event Settings ###############
from .views import SMSEventSettingsView, SMSEventSettingsListView

urlpatterns += [
	url(r'^sms-event-settings', SMSEventSettingsView.as_view()),
	url(r'^sms-event-settings/batch', SMSEventSettingsListView.as_view()),
]

########  SMS  Event ###############
from .views import SMSEventView, SMSEventListView

urlpatterns += [
	url(r'^sms-event', SMSEventView.as_view()),
	url(r'^sms-event/batch', SMSEventListView.as_view()),
]

########  Sender  ID ###############
from .views import SMSIdView, SMSIdListView

urlpatterns += [
	url(r'^smsid', SMSIdView.as_view()),
	url(r'^smsid/batch', SMSIdListView.as_view()),
]

########  SMS Templates  ###############
from .views import SMSTemplateView, SMSTemplateListView

urlpatterns += [
	url(r'^sms-template', SMSTemplateView.as_view()),
	url(r'^sms-template/batch', SMSTemplateListView.as_view()),
]


######## Send SMS ###############
from .views import SendSMSView

urlpatterns += [
	url(r'^send-sms', SendSMSView.as_view()),
]

######## Msg Club Delivery Report ###############
from .views import MsgClubDeliveryReportView

urlpatterns += [
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
