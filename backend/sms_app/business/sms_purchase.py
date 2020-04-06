
from sms_app.models import SMSPurchase

from rest_framework import serializers


class SMSPurchaseModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = SMSPurchase
        fields = '__all__'


def get_sms_purchase_list(data):

    sms_purchase_list = []

    for sms_purchase_object in \
            SMSPurchase.objects.filter(parentSchool_id=data['parentSchool']).order_by('purchaseDateTime'):
        sms_purchase_list.append(SMSPurchaseModelSerializer(sms_purchase_object).data)

    return sms_purchase_list
