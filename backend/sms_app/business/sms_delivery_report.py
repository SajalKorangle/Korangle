import distutils
from distutils import util
import ast

from sms_app.models import SMSDeliveryReport, SMS, SMSId
import requests

from rest_framework import serializers


class SMSDeliveryReportModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = SMSDeliveryReport
        fields = '__all__'


def checkMobileNumberStatus(data):
    mobile_number_json = ast.literal_eval(data["mobileNumberContentJson"])
    for number in mobile_number_json:
        if number['DeliveryStatus'] == 'Sent' or number['DeliveryStatus'] \
                == 'Message in queue' or number['DeliveryStatus'] == 'Submitted to carrier':
            return False
    return True


def get_sms_delivery_report_list(data):
    sms_delivery_report_list = []
    if data['requestId'] == '-1' or data['requestId'] == '0':
        return []
    if bool(distutils.util.strtobool(data['smsGateWayHubVendor'])) is False or (
            bool(distutils.util.strtobool(data['fetchedDeliveryStatus'])) and checkMobileNumberStatus(data)) is True:
        for delivery_report_object in \
                SMSDeliveryReport.objects.filter(requestId=data['requestId']).order_by('mobileNumber'):
            sms_delivery_report_list.append(SMSDeliveryReportModelSerializer(delivery_report_object).data)
    else:
        URL = "https://www.smsgatewayhub.com/api/mt/GetDelivery"
        PARAMS = {"APIKey": "pZD3d2b620aBWzVP5XqD9g", "jobid": data['requestId']}
        response = requests.get(url=URL, params=PARAMS)
        response_json = response.json()
        mobile_number_json = ast.literal_eval(data["mobileNumberContentJson"])

        for report in response_json["DeliveryReports"]:
            for number in mobile_number_json:
                if report["MessageId"] == number["MessageId"]:
                    if checkMobileNumberStatus(data):
                        senderId = SMSId.objects.get(id=data["parentSMSId"]).smsId
                        delivery_report = SMSDeliveryReport.objects.create(requestId=data['requestId'],
                                                                           mobileNumber=number["Number"],
                                                                           status=report["DeliveryStatus"],
                                                                           senderId=senderId,
                                                                           deliveredDateTime=report["DeliveryDate"])
                    else:
                        delivery_report = SMSDeliveryReport.objects.get(requestId=data['requestId'],
                                                                        mobileNumber=number["Number"])
                        delivery_report.status = report["DeliveryStatus"]
                        delivery_report.deliveredDateTime = report["DeliveryDate"]
                        delivery_report.save()

                    sms_delivery_report_list.append(SMSDeliveryReportModelSerializer(delivery_report).data)

        sms_obj = SMS.objects.get(requestId=data['requestId'])
        sms_obj.fetchedDeliveryStatus = True
        sms_obj.save()
    return sms_delivery_report_list
