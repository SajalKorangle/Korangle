
from django.core.exceptions import ObjectDoesNotExist

from employee_app.models import EmployeeSessionDetail

from rest_framework import serializers


class EmployeeSessionDetailModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeSessionDetail
        fields = '__all__'


def get_employee_session_detail_list(data):

    employee_session_detail_list = []

    for employee_session_detail_object in \
            EmployeeSessionDetail.objects.filter(parentEmployee__parentSchool_id=data['parentSchool'],
                                                 parentSession_id=data['sessionId'])\
                    .order_by('parentEmployee__name'):
        employee_session_detail_list.append(EmployeeSessionDetailModelSerializer(employee_session_detail_object).data)

    return employee_session_detail_list


def create_employee_session_detail(data):

    employee_object = EmployeeSessionDetailModelSerializer(data=data)
    if employee_object.is_valid():
        employee_object.save()
        return 'Employee Session Details created successfully'
    else:
        return 'Employee Session Details creation failed'


def update_employee_session_detail(data):

    employee_object = EmployeeSessionDetailModelSerializer(EmployeeSessionDetail.objects.get(id=data['id']), data=data)
    if employee_object.is_valid():
        employee_object.save()
        return 'Employee Session Details updated successfully'
    else:
        return 'Employee Session Details updation failed'


def get_employee_session_detail(data):

    try:
        employee_object = EmployeeSessionDetail.objects.get(parentEmployee_id=data['parentEmployee'],
                                                            parentSession_id=data['sessionId'])
        return EmployeeSessionDetailModelSerializer(employee_object).data
    except ObjectDoesNotExist:
        return {
            'id': None,
            'parentEmployee': data['parentEmployee'],
            'parentSession': data['sessionId'],
            'paidLeaveNumber': None,
        }


'''def delete_employee_session_detail(data):

    EmployeeSessionDetail.objects.get(id=data['id']).delete()

    return 'Employee Session Detail deleted successfully'
'''