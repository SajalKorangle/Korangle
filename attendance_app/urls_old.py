from django.conf.urls import url

urlpatterns = []

######## Student Attendance ###############
from .views_old import StudentAttendanceListView

urlpatterns += [
    url(r'^student-attendances/batch', StudentAttendanceListView.as_view()),
    url(r'^student-attendances', StudentAttendanceListView.as_view()),
]


######## Employee Attendance ###############
from .views_old import EmployeeAttendanceListView

urlpatterns += [
    url(r'^employee-attendances/batch', EmployeeAttendanceListView.as_view()),
    url(r'^employee-attendances', EmployeeAttendanceListView.as_view()),
]


######## Employee Applied Leave ###############
from .views_old import EmployeeAppliedLeaveListView

urlpatterns += [
    url(r'^employee-applied-leaves/batch', EmployeeAppliedLeaveListView.as_view()),
    url(r'^employee-applied-leaves', EmployeeAppliedLeaveListView.as_view()),
]


####### Attendance Permission #############
from .views_old import AttendancePermissionOldView

urlpatterns += [
    url(r'^attendance-permissions-old/(?P<attendance_permission_id>[0-9]+)', AttendancePermissionOldView.as_view()),
    url(r'^attendance-permissions-old', AttendancePermissionOldView.as_view()),
]

