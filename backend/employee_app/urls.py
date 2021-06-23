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


######## Employee Session Details ###############
from .views import EmployeeSessionDetailListView, EmployeeSessionDetailView

urlpatterns += [
	url(r'^employee-session-details/(?P<employee_id>[0-9]+)', EmployeeSessionDetailView.as_view()),
	url(r'^employee-session-details', EmployeeSessionDetailView.as_view()),
	url(r'^(?P<employee_id>[0-9]+)/employee-session-details', EmployeeSessionDetailView.as_view()),
	url(r'^school/(?P<school_id>[0-9]+)/employee-session-details', EmployeeSessionDetailListView.as_view()),
]


######## Employee Permission ###############
from .views import EmployeePermissionOldView, EmployeePermissionOldListView

urlpatterns += [
	url(r'^(?P<employee_id>[0-9]+)/employee-permissions-old', EmployeePermissionOldListView.as_view()),
	url(r'^employee-permissions-old/(?P<employee_permission_id>[0-9]+)', EmployeePermissionOldView.as_view()),
	url(r'^employee-permissions-old/batch', EmployeePermissionOldListView.as_view()),
	url(r'^employee-permissions-old', EmployeePermissionOldView.as_view()),
]

######## Profile Image ############
from .views import ProfileImageView
urlpatterns += [
    url(r'^(?P<employee_id>[0-9]+)/profile-image', ProfileImageView.as_view()),
]


####################################
##### Trying Common Views Below ####
####################################


from .views import EmployeeView, EmployeeListView

urlpatterns += [
	url(r'^employees/batch', EmployeeListView.as_view()),
	url(r'^employees', EmployeeView.as_view()),
]

from .views import EmployeePermissionView, EmployeePermissionListView

urlpatterns += [
	url(r'^employee-permissions/batch', EmployeePermissionListView.as_view()),
	url(r'^employee-permissions', EmployeePermissionView.as_view()),
]

from .views import EmployeeeSessionDetailView, EmployeeeSessionDetailListView

urlpatterns += [
	url(r'^employee-session-detail/batch',EmployeeeSessionDetailListView.as_view()),
	url(r'^employee-session-detail',EmployeeeSessionDetailView.as_view()),
]

from employee_app.views import EmployeeParameterValueView, EmployeeParameterValueListView

urlpatterns += [
    url(r'^employee-parameter-value/batch', EmployeeParameterValueListView.as_view()),
    url(r'^employee-parameter-value', EmployeeParameterValueView.as_view()),
]


from employee_app.views import EmployeeParameterView, EmployeeParameterListView

urlpatterns += [
    url(r'^employee-parameter/batch', EmployeeParameterListView.as_view()),
    url(r'^employee-parameter', EmployeeParameterView.as_view()),
]