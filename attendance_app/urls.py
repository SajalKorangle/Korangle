from django.conf.urls import url

urlpatterns = []

######## Student Attendance ###############
from .views import StudentAttendanceListView

urlpatterns += [
    url(r'^student-attendances/batch', StudentAttendanceListView.as_view()),
    url(r'^student-attendances', StudentAttendanceListView.as_view()),
]


######## Employee Attendance ###############
from .views import EmployeeAttendanceListView

urlpatterns += [
    url(r'^employee-attendances/batch', EmployeeAttendanceListView.as_view()),
    url(r'^employee-attendances', EmployeeAttendanceListView.as_view()),
]


######## Employee Applied Leave ###############
from .views import EmployeeAppliedLeaveListView

urlpatterns += [
    url(r'^employee-applied-leaves/batch', EmployeeAppliedLeaveListView.as_view()),
    url(r'^employee-applied-leaves', EmployeeAppliedLeaveListView.as_view()),
]


####### Attendance Permission #############
from .views import AttendancePermissionView

urlpatterns += [
    url(r'^attendance-permissions/(?P<attendance_permission_id>[0-9]+)', AttendancePermissionView.as_view()),
    url(r'^attendance-permissions', AttendancePermissionView.as_view()),
]


###### Section Attendance ################
# from .views import SectionAttendanceView

# urlpatterns += [
#     url(r'^section-attendances/batch', SectionAttedanceView.as_view()),
# ]
