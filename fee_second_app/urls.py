from django.conf.urls import url

urlpatterns = []

######### Fee Structure ###########
from .views import fee_structure_view, fee_status_view
urlpatterns += [
	url(r'^school/(?P<school_id>[0-9]+)/session/(?P<session_id>[0-9]+)/fee-structure', fee_structure_view),
]

######### Student Fee Status ###########
from .views import fee_structure_view
urlpatterns += [
	url(r'^student/(?P<student_id>[0-9]+)/fee-status', fee_status_view),
]

######### Fee Receipts ###########
from .views import student_fee_receipt_view, school_fee_receipt_view
urlpatterns += [
	url(r'^student/(?P<student_id>[0-9]+)/fee-receipts', student_fee_receipt_view),
]

urlpatterns += [
	url(r'^school/(?P<school_id>[0-9]+)/fee-receipts', school_fee_receipt_view),
]

######### Fee Receipts ###########
from .views import student_concession_view, school_concession_view
urlpatterns += [
	url(r'^student/(?P<student_id>[0-9]+)/concessions', student_concession_view),
]

urlpatterns += [
	url(r'^school/(?P<school_id>[0-9]+)/concessions', school_concession_view),
]
