import ast
from distutils import util
import xml.etree.ElementTree as ET
from sms_app.models import SMSDeliveryReport, SMSId
from rest_framework import serializers


class SMSDeliveryReportModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = SMSDeliveryReport
        fields = '__all__'


def get_sms_delivery_report_list(data):
    sms_delivery_report_list = []
    mobile_number_json = ast.literal_eval(data["mobileNumberContentJson"])
    if bool(util.strtobool(data['smsGateWayHubVendor'])) is False:
        for sms_delivery_object in \
                SMSDeliveryReport.objects.filter(requestId=data['requestId']).order_by('mobileNumber'):
            sms_delivery_report_list.append(SMSDeliveryReportModelSerializer(sms_delivery_object).data)
    else:
        # mobile number json contains MobileNumber,MessageId,Message Mapped
        for number in mobile_number_json:
            try:
                delivery_report_object = SMSDeliveryReport.objects.get(messageId=number['MessageId'])
                sms_delivery_report_list.append(SMSDeliveryReportModelSerializer(delivery_report_object).data)
            except SMSDeliveryReport.DoesNotExist:
                print("Not received status yet")
    return sms_delivery_report_list


def handle_sms_delivery_report(data_from_vendor):
    delivery_report = ET.fromstring(data_from_vendor[6:]).find('DLR')
    SMSDeliveryReport.objects.create(status=delivery_report.find('MessageStatus').text,
                                     messageId=delivery_report.find('MessageId').text,
                                     deliveredDateTime=delivery_report.find('DeliveryDate').text,
                                     statusCode=delivery_report.find('ErrorCode').text)
