import distutils
from distutils import util

from django.db.models import Q

from sms_app.models import SMS

from rest_framework import serializers


class SMSModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = SMS
        fields = '__all__'


def get_sms_list(data):

    sms_list = []

    for sms_object in \
            SMS.objects.filter(Q(sentStatus='PENDING') | Q(sentStatus='SUCCESS'),
                               parentSchool_id=data['parentSchool'],
                               sentDateTime__gte=data['startDateTime'],
                               sentDateTime__lte=data['endDateTime']).order_by('sentDateTime'):
        sms_list.append(SMSModelSerializer(sms_object).data)

    return sms_list


def create_sms(data):

    sms_object = SMSModelSerializer(data=data)
    if sms_object.is_valid():
        sms_object.save()
        return 'SMS recorded successfully'
    else:
        print('SMS recording failed')
        return 'SMS recording failed'

