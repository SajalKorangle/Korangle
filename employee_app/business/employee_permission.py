
from employee_app.models import EmployeePermission

from rest_framework import serializers


class EmployeePermissionModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeePermission
        fields = '__all__'


def get_employee_permission_list(data):

    employee_permission_list = []

    for employee_permission in EmployeePermission.objects.filter(parentEmployee_id=data['parentEmployee'])\
            .order_by('parentTask__parentModule__orderNumber', 'parentTask__orderNumber'):
        employee_permission_list.append(EmployeePermissionModelSerializer(employee_permission).data)

    return employee_permission_list


def create_employee_permission(data):

    employee_permission_serializer = EmployeePermissionModelSerializer(data=data)
    if employee_permission_serializer.is_valid():
        employee_permission_object = employee_permission_serializer.save()
        return {
            'status': 'success',
            'message': 'Employee Permission given successfully',
            'id': employee_permission_object.id,
        }
    else:
        return {
            'status': 'failure',
            'message': 'Employee Permission failed',
        }


def delete_employee_permission(data):

    EmployeePermission.objects.get(id=data['id']).delete()

    return 'Employee Permission revoked successfully'
