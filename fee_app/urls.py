from django.conf.urls import url

urlpatterns = []

########## Common #################
from .views import get_student_fee_data_view
urlpatterns += [
	url(r'^get_student_fee_data/', get_student_fee_data_view),
]

########## Submit Fee #############
from .views import new_fee_receipt_view
urlpatterns += [
	url(r'^new_fee_receipt/', new_fee_receipt_view),
]

########## Fees List ##############
from .views import fees_list_view
urlpatterns += [
	url(r'^fees_list/', fees_list_view),
]

########## New Concession ###########
from .views import new_concession_view
urlpatterns += [
	url(r'^new_concession/', new_concession_view),
]

######### Concession List #########
from .views import concession_list_view
urlpatterns += [
		url(r'^concession_list/', concession_list_view),
]

#####################################################
################# ALL NEW FEES ######################
#####################################################

######### Fee Structure ###########
from .views import fee_structure_view, fee_status_view
urlpatterns += [
	url(r'^school/(?P<school_id>[0-9]+)/session/(?P<session_id>[0-9]+)/fee-structure', fee_structure_view),
]

######### Student Fee Status ###########
from .views import fee_structure_view
urlpatterns += [
	url(r'^student/(?P<student_id>[0-9]+)/session/(?P<session_id>[0-9]+)/fee-status', fee_status_view),
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
