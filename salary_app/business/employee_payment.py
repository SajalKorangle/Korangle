
from salary_app.models import EmployeePayment

from rest_framework import serializers


class EmployeePaymentModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeePayment
        fields = '__all__'


def get_school_employee_payment_list(data):

    employee_payment_list = []

    for employee_payment_object in \
            EmployeePayment.objects.filter(parentEmployee__parentSchool_id=data['parentSchool'])\
                    .order_by('dateOfPayment'):
        employee_payment_list.append(EmployeePaymentModelSerializer(employee_payment_object).data)

    return employee_payment_list


def get_employee_payment_list(data):

    employee_payment_list = []

    for employee_payment_object in \
            EmployeePayment.objects.filter(parentEmployee_id=data['parentEmployee'])\
                    .order_by('dateOfPayment'):
        employee_payment_list.append(EmployeePaymentModelSerializer(employee_payment_object).data)

    return employee_payment_list


def create_employee_payment(data):

    print(data)
    employee_payment_serializer = EmployeePaymentModelSerializer(data=data)
    if employee_payment_serializer.is_valid():
        employee_payment_serializer.save()
        return {
            'employeePayment': employee_payment_serializer.data,
            'message': 'Record generated successfully',
        }
    else:
        return {
            'message': 'Record generation failed',
        }

"""
def update_employee_payment(data):

    employee_payment_serializer = EmployeePaymentModelSerializer(EmployeePayment.objects.get(id=data['id']), data=data)
    if employee_payment_serializer.is_valid():
        employee_payment_serializer.save()
        return {
            'id': employee_payment_serializer.data['id'],
            'message': 'Record updated successfully',
        }
    else:
        return 'Record updation failed'
"""


def delete_employee_payment(data):

    EmployeePayment.objects.get(id=data['id']).delete()

    return 'Record deleted successfully'