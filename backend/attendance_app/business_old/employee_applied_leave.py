
from attendance_app.models import EmployeeAppliedLeave

from rest_framework import serializers


class EmployeeAppliedLeaveModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeAppliedLeave
        fields = '__all__'


def get_employee_applied_leave_list(data):

    employee_applied_leave_list = []

    for employee_id in data['employeeIdList'].split(','):
        for employee_applied_leave_object in \
                EmployeeAppliedLeave.objects.filter(parentEmployee_id=employee_id,
                                                    dateOfLeave__gte=data['startDate'],
                                                    dateOfLeave__lte=data['endDate'])\
                        .order_by('dateOfLeave'):
            employee_applied_leave_list.append(EmployeeAppliedLeaveModelSerializer(employee_applied_leave_object).data)

    return employee_applied_leave_list


def create_employee_applied_leave_list(data):

    for employee_applied_leave_data in data:

        employee_applied_leave_object, created = \
            EmployeeAppliedLeave.objects.get_or_create(parentEmployee_id=employee_applied_leave_data['parentEmployee'],
                                                       dateOfLeave=employee_applied_leave_data['dateOfLeave'])
        employee_applied_leave_object.status = employee_applied_leave_data['status']
        employee_applied_leave_object.halfDay = employee_applied_leave_data['halfDay']
        employee_applied_leave_object.paidLeave = employee_applied_leave_data['paidLeave']
        employee_applied_leave_object.save()

    return {
        'status': 'success',
        'message': 'Employee Leave recorded successfully',
    }


def update_employee_applied_leave_list(data):

    for employee_data in data:

        employee_object = EmployeeAppliedLeaveModelSerializer(EmployeeAppliedLeave.objects.get(id=employee_data['id']),
                                                              data=employee_data)
        if employee_object.is_valid():
            employee_object.save()
        else:
            return 'Employee Profile updation failed'

    return 'Employee Leave recorded successfully'


'''def delete_employee_attendance_list(data):

    for employee_id in data['employeeIdList'].split(','):
        EmployeeAttendance.objects.filter(parentEmployee_id=employee_id,
                                          dateOfAttendance__gte=data['startDate'],
                                          dateOfAttendance__lte=data['endDate']).delete()

    return 'Employee Attendance Record deleted Successfully'
'''
