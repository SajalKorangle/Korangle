from django.conf.urls import url

urlpatterns = []

######### Fee Type ################
from .views import FeeTypeView
urlpatterns += [
    url(r'^fee-types/', FeeTypeView.as_view())
]


######### Fee Structure ###########
from .views import fee_structure_view
urlpatterns += [
    url(r'^school/(?P<school_id>[0-9]+)/session/(?P<session_id>[0-9]+)/fee-structure', fee_structure_view),
]

######### School Fee Definition ##########
from .views import FeeDefinitionView
urlpatterns += [
    url(r'^school/(?P<school_id>[0-9]+)/fee-definitions', FeeDefinitionView.as_view()),
]

######### Student Fee Status ###########
from .views import StudentFeeStatusView
urlpatterns += [
    url(r'^student/(?P<student_id>[0-9]+)/fee-status', StudentFeeStatusView.as_view()),
]

######### Fee Receipts ###########
from .views import StudentFeeReceiptView, SchoolFeeReceiptView
urlpatterns += [
    url(r'^student/(?P<student_id>[0-9]+)/fee-receipts', StudentFeeReceiptView.as_view()),
]

urlpatterns += [
    url(r'^school/(?P<school_id>[0-9]+)/fee-receipts', SchoolFeeReceiptView.as_view()),
]

######### Concession ###########
from .views import StudentConcessionView, SchoolConcessionView
urlpatterns += [
    url(r'^student/(?P<student_id>[0-9]+)/concessions', StudentConcessionView.as_view()),
]

urlpatterns += [
    url(r'^school/(?P<school_id>[0-9]+)/concessions', SchoolConcessionView.as_view()),
]
