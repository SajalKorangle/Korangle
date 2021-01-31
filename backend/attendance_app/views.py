
from common.common_views_3 import CommonView, CommonListView, APIView

from attendance_app.models import EmployeeAttendance, StudentAttendance, EmployeeAppliedLeave, AttendancePermission, AttendanceSettings


# Create your views here.


########### Employee Applied Leave #############


class EmployeeAppliedLeaveView(CommonView, APIView):
    Model = EmployeeAppliedLeave
    RelationsToSchool = ['parentEmployee__parentSchool__id']


class EmployeeAppliedLeaveListView(CommonListView, APIView):
    Model = EmployeeAppliedLeave
    RelationsToSchool = ['parentEmployee__parentSchool__id']


########### StudentAttendance #############


class StudentAttendanceView(CommonView, APIView):
    Model = StudentAttendance
    RelationsToSchool = ['parentStudent__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']


class StudentAttendanceListView(CommonListView, APIView):
    Model = StudentAttendance
    RelationsToSchool = ['parentStudent__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']


########### Employee Attendance #############


class EmployeeAttendanceView(CommonView, APIView):
    Model = EmployeeAttendance
    RelationsToSchool = ['parentEmployee__parentSchool__id']


class EmployeeAttendanceListView(CommonListView, APIView):
    Model = EmployeeAttendance
    RelationsToSchool = ['parentEmployee__parentSchool__id']


########### Attendance Permission #############


class AttendancePermissionView(CommonView, APIView):
    Model = AttendancePermission
    RelationsToSchool = ['parentEmployee__parentSchool__id']


class AttendancePermissionListView(CommonListView, APIView):
    Model = AttendancePermission
    RelationsToSchool = ['parentEmployee__parentSchool__id']


########### Attendance Settings #############


class AttendanceSettingsListView(CommonListView, APIView):
    Model = AttendanceSettings


class AttendanceSettingsView(CommonView, APIView):
    Model = AttendanceSettings

