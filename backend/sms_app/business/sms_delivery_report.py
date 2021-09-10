import distutils
from datetime import datetime
from distutils import util
import ast

from sms_app.models import SMSDeliveryReport, SMS, SMSId
import requests

from rest_framework import serializers


class SMSDeliveryReportModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = SMSDeliveryReport
        fields = '__all__'


def isMobileNumberPending(data): # if any of the mobile number is in temporary status call api again to update it
    mobile_number_json = ast.literal_eval(data["mobileNumberContentJson"])
    for number in mobile_number_json:
        try:
            delivery_report = SMSDeliveryReport.objects.get(requestId=data['requestId'],
                                                            messageId=number["MessageId"],
                                                            mobileNumber=number["Number"])
            if delivery_report.status == 'Sent' or delivery_report.status \
                    == 'Message in queue' or delivery_report.status == 'Submitted to carrier':
                return True
        except SMSDeliveryReport.DoesNotExist:
            return True
    return False


def get_sms_delivery_report_list(data):
    sms_delivery_report_list = []
    print(data)
    if data['requestId'] == '-1':
        return []
    if bool(distutils.util.strtobool(data['smsGateWayHubVendor'])) is False or bool(distutils.util.strtobool(
            data['fetchedDeliveryStatus'])) is True:
        for delivery_report_object in \
                SMSDeliveryReport.objects.filter(requestId=data['requestId']).order_by('mobileNumber'):
            sms_delivery_report_list.append(SMSDeliveryReportModelSerializer(delivery_report_object).data)
    else:
        print(data['scheduledDateTime'])
        mobile_number_json = ast.literal_eval(data["mobileNumberContentJson"])

        if data['scheduledDateTime'] is not None:
            URL = "https://www.smsgatewayhub.com/smsapi/mis.aspx"
            scheduledDate = datetime.fromisoformat(data['scheduledDateTime']).strftime('%m/%d/%Y')
            PARAMS = {"user": "korangle", "password": 298545, "fromdate": scheduledDate, "todate": scheduledDate}
            response = requests.get(url=URL, params=PARAMS)
            response_string = response.content.__str__()
            print(response_string)
            repsons_array = response_string.split(",")
            for number in mobile_number_json:
                if number["MessageId"] in repsons_array:
                    index = repsons_array.index(number["MessageId"])
                    try:
                        delivery_report = SMSDeliveryReport.objects.get(messageId=number["MessageId"],
                                                                        mobileNumber=number["Number"])
                        delivery_report.status = repsons_array[index - 2]
                        delivery_report.deliveredDateTime = repsons_array[index - 1]
                        delivery_report.save()

                    except SMSDeliveryReport.DoesNotExist:
                        print(repsons_array[index - 2])
                        senderId = SMSId.objects.get(id=data["parentSMSId"]).smsId
                        delivery_report = SMSDeliveryReport.objects.create(requestId=data['requestId'],
                                                                           mobileNumber=number["Number"],
                                                                           status=repsons_array[index - 2],
                                                                           messageId=number["MessageId"],
                                                                           senderId=senderId,
                                                                           deliveredDateTime=repsons_array[index - 1])
                else:
                    senderId = SMSId.objects.get(id=data["parentSMSId"]).smsId
                    delivery_report = SMSDeliveryReport.objects.create(requestId=data['requestId'],
                                                                       mobileNumber=number["Number"],
                                                                       status="Scheduled",
                                                                       messageId=number["MessageId"],
                                                                       senderId=senderId)
                sms_delivery_report_list.append(SMSDeliveryReportModelSerializer(delivery_report).data)
        else:
            URL = "https://www.smsgatewayhub.com/api/mt/GetDelivery"
            PARAMS = {"APIKey": "pZD3d2b620aBWzVP5XqD9g", "jobid": data['requestId']}
            response = requests.get(url=URL, params=PARAMS)
            response_json = response.json()

            for report in response_json["DeliveryReports"]:
                for number in mobile_number_json:
                    if report["MessageId"] == number["MessageId"]:
                        try:
                            delivery_report = SMSDeliveryReport.objects.get(requestId=data['requestId'],
                                                                            mobileNumber=number["Number"])
                            delivery_report.status = report["DeliveryStatus"]
                            delivery_report.deliveredDateTime = report["DeliveryDate"]
                            delivery_report.messageId = number["MessageId"]
                            delivery_report.save()

                        except SMSDeliveryReport.DoesNotExist:
                            senderId = SMSId.objects.get(id=data["parentSMSId"]).smsId
                            delivery_report = SMSDeliveryReport.objects.create(requestId=data['requestId'],
                                                                               mobileNumber=number["Number"],
                                                                               status=report["DeliveryStatus"],
                                                                               messageId=number["MessageId"],
                                                                               senderId=senderId,
                                                                               deliveredDateTime=report["DeliveryDate"])

                        sms_delivery_report_list.append(SMSDeliveryReportModelSerializer(delivery_report).data)

        if isMobileNumberPending(data) is False:
            sms_obj = SMS.objects.get(id=data['parentSMSDbId'])
            sms_obj.fetchedDeliveryStatus = True
            sms_obj.save()
    return sms_delivery_report_list
