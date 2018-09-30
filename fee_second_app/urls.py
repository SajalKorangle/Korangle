from django.conf.urls import url

urlpatterns = []

######### Fee Type ################
from .views import FeeTypeView
urlpatterns += [
    url(r'^fee-types/', FeeTypeView.as_view())
]


######### Fee Structure ###########
from .views import FeeStructureView
urlpatterns += [
    url(r'^school/(?P<school_id>[0-9]+)/fee-structures', FeeStructureView.as_view()),
]

######### School Fee Definition ##########
from .views import FeeDefinitionView
urlpatterns += [
    url(r'^school/(?P<school_id>[0-9]+)/fee-definitions', FeeDefinitionView.as_view()),
    url(r'^fee-definitions/(?P<fee_definition_id>[0-9]+)', FeeDefinitionView.as_view()),
]

######### School Fee Component #########
from .views import SchoolFeeComponentView
urlpatterns += [
    url(r'^fee-definition/(?P<fee_definition_id>[0-9]+)/school-fee-components', SchoolFeeComponentView.as_view()),
    url(r'^school-fee-components/(?P<school_fee_component_id>[0-9]+)', SchoolFeeComponentView.as_view()),
]

######### Student Fee Status ###########
from .views import StudentFeeStatusView
urlpatterns += [
    url(r'^student/(?P<student_id>[0-9]+)/fee-status', StudentFeeStatusView.as_view()),
]

######### Student Fee Profile ###########
from .views import StudentFeeProfileListView, StudentFeeProfileView
urlpatterns += [
    url(r'^school/(?P<school_id>[0-9]+)/student-fee-profiles', StudentFeeProfileListView.as_view()),
    url(r'^student/(?P<student_id>[0-9]+)/student-fee-profiles', StudentFeeProfileView.as_view()),
]

######### Student Fee Dues ###########
from .views import StudentFeeDuesListView
urlpatterns += [
    url(r'^school/(?P<school_id>[0-9]+)/student-fee-dues', StudentFeeDuesListView.as_view()),
]

######### Fee Receipts ###########
from .views import StudentFeeReceiptView, SchoolFeeReceiptView, EmployeeFeeReceiptView

urlpatterns += [
    url(r'^student/(?P<student_id>[0-9]+)/fee-receipts', StudentFeeReceiptView.as_view()),
    url(r'^school/(?P<school_id>[0-9]+)/fee-receipts', SchoolFeeReceiptView.as_view()),
    url(r'^employee/(?P<employee_id>[0-9]+)/fee-receipts', EmployeeFeeReceiptView.as_view()),
]

######### Concession ###########
from .views import StudentConcessionView, SchoolConcessionView

urlpatterns += [
    url(r'^student/(?P<student_id>[0-9]+)/concessions', StudentConcessionView.as_view()),
    url(r'^school/(?P<school_id>[0-9]+)/concessions', SchoolConcessionView.as_view()),
]
