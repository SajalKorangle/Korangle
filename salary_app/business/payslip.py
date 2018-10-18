
from salary_app.models import Payslip

from rest_framework import serializers


class PayslipModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payslip
        fields = '__all__'


def get_school_payslip_list(data):

    payslip_list = []

    for payslip_object in \
            Payslip.objects.filter(parentEmployee__parentSchool_id=data['parentSchool'])\
                    .order_by('dateOfGeneration'):
        payslip_list.append(PayslipModelSerializer(payslip_object).data)

    return payslip_list


def get_payslip_list(data):

    payslip_list = []

    for payslip_object in \
            Payslip.objects.filter(parentEmployee_id=data['parentEmployee'])\
                    .order_by('dateOfGeneration'):
        payslip_list.append(PayslipModelSerializer(payslip_object).data)

    return payslip_list


def get_payslip(data):

    if data['id'] is '0':
        payslip_queryset = Payslip.objects.filter(parentEmployee=data['parentEmployee'],
                                                  month=data['month'],
                                                  year=data['year'])
        if payslip_queryset.count() is 0:
            return None
        else:
            return PayslipModelSerializer(payslip_queryset[0]).data
    else:
        return PayslipModelSerializer(Payslip.objects.get(id=data['id'])).data


def create_payslip(data):

    payslip_serializer = PayslipModelSerializer(data=data)
    if payslip_serializer.is_valid():
        payslip_serializer.save()
        return {
            'id': payslip_serializer.data['id'],
            'message': 'Payslip generated successfully',
        }
    else:
        return 'Payslip generation failed'


def update_payslip(data):

    payslip_serializer = PayslipModelSerializer(Payslip.objects.get(id=data['id']), data=data)
    if payslip_serializer.is_valid():
        payslip_serializer.save()
        return {
            'id': payslip_serializer.data['id'],
            'message': 'Payslip updated successfully',
        }
    else:
        return 'Payslip updation failed'


def delete_payslip(data):

    Payslip.objects.get(id=data['id']).delete()

    return 'Payslip deleted successfully'