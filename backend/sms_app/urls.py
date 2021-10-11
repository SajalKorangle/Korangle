from django.conf.urls import url

urlpatterns = []

######## SMS Purchase ###############
from .views import SMSPurchaseOldView

urlpatterns += [
	url(r'^school/(?P<school_id>[0-9]+)/sms-purchases', SMSPurchaseOldView.as_view()),
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
    url(r'^sms-event-settings/batch', SMSEventSettingsListView.as_view()),
    url(r'^sms-event-settings', SMSEventSettingsView.as_view()),
]

from .views import SMSIdSchoolView, SMSIdSchoolListView

urlpatterns += [
    url(r'^sms-id-school/batch', SMSIdSchoolListView.as_view()),
    url(r'^sms-id-school', SMSIdSchoolView.as_view()),
]

########  Sender  ID ###############
from .views import SMSIdView, SMSIdListView

urlpatterns += [
    url(r'^sms-id/batch', SMSIdListView.as_view()),
    url(r'^sms-id', SMSIdView.as_view()),
]

<< << << < HEAD
######## SMS PURCHASE ##############
from .views import SMSPurchaseView, SMSPurchaseListView

urlpatterns += [
	url(r'^sms-purchase/batch', SMSPurchaseListView.as_view()),
	url(r'^sms-purchase', SMSPurchaseView.as_view()),
== == == =
########  SMS Templates  ###############
from .views import SMSTemplateView, SMSTemplateListView

urlpatterns += [
    url(r'^sms-template/batch', SMSTemplateListView.as_view()),
    url(r'^sms-template', SMSTemplateView.as_view()),
]

######## SMS Delivery Report ###############
from .views import SMSDeliveryReportView

urlpatterns += [
    url(r'^sms-delivery-report', SMSDeliveryReportView.as_view()),
>>>>>> > a7eebccf7c8600733accc41f906f16cf35729598
]

######## SMS ##############
from .views import SmsView, SmsListView

urlpatterns += [
    url(r'^send-sms/batch', SmsListView.as_view()),
    url(r'^send-sms', SmsView.as_view()),
]

######## CONSTANT DATABASE ##############
from .views import SMSEventView, SMSEventListView

urlpatterns += [
    url(r'^sms-event/batch', SMSEventListView.as_view()),
    url(r'^sms-event', SMSEventView.as_view()),
]

from .views import SMSDefaultTemplateView, SMSDefaultTemplateListView

urlpatterns += [
    url(r'^sms-default-template/batch', SMSDefaultTemplateListView.as_view()),
    url(r'^sms-default-template', SMSDefaultTemplateView.as_view()),
]

#########  OnlineSmsPaymentTransaction ############
from .views import OnlineSmsPaymentTransactionView, OnlineSmsPaymentTransactionListView

urlpatterns += [
	url(r'^online-sms-payment-transaction/batch', OnlineSmsPaymentTransactionListView.as_view()),
	url(r'^online-sms-payment-transaction', OnlineSmsPaymentTransactionView.as_view()),
]
