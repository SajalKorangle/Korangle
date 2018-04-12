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
