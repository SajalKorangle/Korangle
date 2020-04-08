from django.conf.urls import url

urlpatterns = []

######## Enquiry ###############
from .views import EnquiryProfileView, EnquiryListView

urlpatterns += [
	url(r'^enquiries/(?P<enquiry_id>[0-9]+)', EnquiryProfileView.as_view()),
	url(r'^enquiries$', EnquiryProfileView.as_view()),
	url(r'^school/(?P<school_id>[0-9]+)/enquiries', EnquiryListView.as_view()),
]

######## Mini Enquiry ###############
from .views import MiniEnquiryView

urlpatterns += [
	url(r'^school/(?P<school_id>[0-9]+)/mini-enquiries', MiniEnquiryView.as_view()),
]

from .views import EnquiryView, EnquiryListView

urlpatterns += [
	url(r'^enquiry/batch',EnquiryListView.as_view()),
	url(r'^enquiry',EnquiryView)
]