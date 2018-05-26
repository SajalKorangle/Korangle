from django.conf.urls import url

urlpatterns = []

######## Employee Profile ###############
from .views import EmployeeProfileView, EmployeeProfileListView

urlpatterns += [
	url(r'^employee-profiles/(?P<employee_id>[0-9]+)', EmployeeProfileView.as_view()),
	url(r'^employee-profiles', EmployeeProfileView.as_view()),
	url(r'^school/(?P<school_id>[0-9]+)/employee-profiles', EmployeeProfileListView.as_view()),
]

######## Employee Mini Profile ###############
from .views import EmployeeMiniProfileView

urlpatterns += [
	url(r'^school/(?P<school_id>[0-9]+)/employee-mini-profiles', EmployeeMiniProfileView.as_view()),
]

