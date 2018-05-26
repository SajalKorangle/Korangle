
from employee_app.models import Employee

from rest_framework import serializers


class EmployeeModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'


def get_employee_profile_list(data):

    employee_list = []

    for employee_object in Employee.objects.filter(parentSchool_id=data['parentSchool']).order_by('name'):
        employee_list.append(EmployeeModelSerializer(employee_object).data)

    return employee_list


def create_employee_profile(data):

    employee_object = EmployeeModelSerializer(data=data)
    if employee_object.is_valid():
        employee_object.save()
        return 'Employee Profile created successfully'
    else:
        return 'Employee Profile creation failed'


def update_employee_profile(data):

    employee_object = EmployeeModelSerializer(Employee.objects.get(id=data['id']), data=data)
    if employee_object.is_valid():
        employee_object.save()
        return 'Employee Profile updated successfully'
    else:
        return 'Employee Profile updation failed'


def get_employee_profile(data):

    employee_object = Employee.objects.get(id=data['id'])
    return EmployeeModelSerializer(employee_object).data


def delete_employee_profile(data):

    Employee.objects.get(id=data['id']).delete()

    return 'Employee Profile deleted successfully'