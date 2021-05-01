
from sms_app.models import SMSId

from rest_framework import serializers


class SMSIdModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = SMSId
        fields = '__all__'

