
from attendance_app.models import EmployeeAttendance

from rest_framework import serializers


class EmployeeAttendanceModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeAttendance
        fields = '__all__'


def get_employee_attendance_list(data):

    employee_attendance_list = []

    for employee_id in data['employeeIdList'].split(','):
        for employee_attendance_object in \
                EmployeeAttendance.objects.filter(parentEmployee_id=employee_id,
                                                  dateOfAttendance__gte=data['startDate'],
                                                  dateOfAttendance__lte=data['endDate'])\
                        .order_by('dateOfAttendance'):
            employee_attendance_list.append(EmployeeAttendanceModelSerializer(employee_attendance_object).data)

    return employee_attendance_list


def create_or_update_employee_attendance_list(data):

    for employee_attendance_data in data:

        employee_attendance_object, created = \
            EmployeeAttendance.objects.get_or_create(parentEmployee_id=employee_attendance_data['parentEmployee'],
                                                     dateOfAttendance=employee_attendance_data['dateOfAttendance'])
        employee_attendance_object.status = employee_attendance_data['status']
        employee_attendance_object.save()

    return 'Employee Attendance recorded successfully'


def delete_employee_attendance_list(data):

    for employee_id in data['employeeIdList'].split(','):
        EmployeeAttendance.objects.filter(parentEmployee_id=employee_id,
                                          dateOfAttendance__gte=data['startDate'],
                                          dateOfAttendance__lte=data['endDate']).delete()

    return 'Employee Attendance Record deleted Successfully'

