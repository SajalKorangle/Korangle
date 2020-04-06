
from employee_app.models import Employee

from rest_framework import serializers


class EmployeeModelSerializer(serializers.ModelSerializer):

    instance_field_list = []

    '''def __init__(self):
        self.instance_field_list = Employee._meta.get_fields(include_parents=False)
        self.instance_field_list = list(map(lambda x: x.name,
                                       filter(lambda x: x.concrete and x.get_internal_type() == 'FileField',
                                              self.instance_field_list)))
        return super(EmployeeModelSerializer, self).__init__()'''

    class Meta:
        model = Employee
        fields = '__all__'


def get_employee_profile_list(data):

    employee_list = []

    for employee_object in Employee.objects.filter(parentSchool_id=data['parentSchool']).order_by('name'):
        employee_list.append(EmployeeModelSerializer(employee_object).data)

    return employee_list


def create_employee_profile(data):

    employee_serializer = EmployeeModelSerializer(data=data)
    if employee_serializer.is_valid():
        employee_serializer.save()
        return {
            'id': employee_serializer.data['id'],
            'message': 'Employee Profile created successfully',
        }
    else:
        return 'Employee Profile creation failed'


def update_employee_profile(data):

    instance_field_list = Employee._meta.get_fields(include_parents=False)
    instance_field_list = list(map(lambda x: x.name, filter(lambda x: x.concrete and x.get_internal_type() == 'FileField',
                                                       instance_field_list)))

    delete_list = []
    for attr, value in data.items():
        if attr in instance_field_list:
            delete_list.append(attr)

    for field_name in delete_list:
        del data[field_name]

    # del data['profileImage']
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