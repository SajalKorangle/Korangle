from django.conf.urls import url

urlpatterns = []


from attendance_app.views import EmployeeAttendanceView, EmployeeAttendanceListView

urlpatterns += [
    url(r'^employee-attendance/batch', EmployeeAttendanceListView.as_view()),
    url(r'^employee-attendance', EmployeeAttendanceView.as_view()),
]


from attendance_app.views import StudentAttendanceView, StudentAttendanceListView

urlpatterns += [
    url(r'^student-attendance/batch', StudentAttendanceListView.as_view()),
    url(r'^student-attendance', StudentAttendanceView.as_view()),
]


from attendance_app.views import EmployeeAppliedLeaveView, EmployeeAppliedLeaveListView

urlpatterns += [
    url(r'^employee-applied-leave/batch', EmployeeAppliedLeaveListView.as_view()),
    url(r'^employee-applied-leave', EmployeeAppliedLeaveView.as_view()),
]


from attendance_app.views import AttendancePermissionView, AttendancePermissionListView

urlpatterns += [
    url(r'^attendance-permission/batch', AttendancePermissionListView.as_view()),
    url(r'^attendance-permission', AttendancePermissionView.as_view()),
]

from attendance_app.views import AttendanceSettingsListView, AttendanceSettingsView

urlpatterns += [
    url(r'^attendance-settings/batch', AttendanceSettingsListView.as_view()),
    url(r'^attendance-settings', AttendanceSettingsView.as_view()),    
]


