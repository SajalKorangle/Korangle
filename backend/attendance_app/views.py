
from common.common_views import CommonView, CommonListView, APIView

from attendance_app.models import EmployeeAttendance, StudentAttendance, EmployeeAppliedLeave, AttendancePermission, AttendanceSettings


# Create your views here.


########### Employee Applied Leave #############


class EmployeeAppliedLeaveView(CommonView, APIView):
    Model = EmployeeAppliedLeave


class EmployeeAppliedLeaveListView(CommonListView, APIView):
    Model = EmployeeAppliedLeave


########### StudentAttendance #############


class StudentAttendanceView(CommonView, APIView):
    Model = StudentAttendance


class StudentAttendanceListView(CommonListView, APIView):
    Model = StudentAttendance


########### Employee Attendance #############


class EmployeeAttendanceView(CommonView, APIView):
    Model = EmployeeAttendance


class EmployeeAttendanceListView(CommonListView, APIView):
    Model = EmployeeAttendance


########### Attendance Permission #############


class AttendancePermissionView(CommonView, APIView):
    Model = AttendancePermission


class AttendancePermissionListView(CommonListView, APIView):
    Model = AttendancePermission


########### Attendance Settings #############

class AttendanceSettingsListView(CommonListView, APIView):
    Model = AttendanceSettings
    
class AttendanceSettingsView(CommonView, APIView):
    Model = AttendanceSettings
    