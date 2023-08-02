import ast
from datetime import datetime
from distutils import util
import xml.etree.ElementTree as ET
from sms_app.models import SMSDeliveryReport
from rest_framework import serializers


class SMSDeliveryReportModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = SMSDeliveryReport
        fields = '__all__'


def get_sms_delivery_report_list(data):
    sms_delivery_report_list = []
    if bool(util.strtobool(data['smsGateWayHubVendor'])) is False:
        for sms_delivery_object in \
                SMSDeliveryReport.objects.filter(requestId=data['requestId']).order_by('mobileNumber'):
            sms_delivery_report_list.append(SMSDeliveryReportModelSerializer(sms_delivery_object).data)
    else:
        mobile_number_json = ast.literal_eval(data["mobileNumberContentJson"])
        # mobile number json contains MobileNumber,MessageId,Message (Mapped)
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
                                     deliveredDateTime=datetime.strptime(delivery_report.find('DeliveryDate').text,
                                                                         "%d-%m-%Y %H:%M:%S").strftime("%Y-%m-%d %H:%M:%S"),
                                     statusCode=delivery_report.find('ErrorCode').text)


def handle_msg_club_delivery_report(data):

    for status in data:

        report = {
            'requestId': status['requestId'],
            'mobileNumber': int(status['mobileNumber'][2:]),
            'status': status['status'],
            'statusCode': status['statusCode'],
            'deliveredDateTime': status['deliveredDateTime'] + "+05:30",
            'senderId': status['senderId'],
        }

        try:

            report_object = SMSDeliveryReport.objects.get(requestId=report['requestId'],
                mobileNumber=report['mobileNumber'])

            report_object.status = report['status']
            report_object.statusCode = report['statusCode']
            report_object.deliveredDateTime = report['deliveredDateTime']
            report_object.senderId = report['senderId']
            report_object.save()

        except:

            SMSDeliveryReport.objects.create(
                requestId=report['requestId'],
                mobileNumber=report['mobileNumber'],
                status=report['status'],
                statusCode=report['statusCode'],
                deliveredDateTime=report['deliveredDateTime'],
                senderId=report['senderId']
            )
        

### MESG CLUB VENDOR FUNCTIONS ###
# def get_msg_club_delivery_report_list(data):
#
#     msg_club_delivery_report_list = []
#
#     for msg_club_delivery_report_object in \
#             MsgClubDeliveryReport.objects.filter(requestId=data['requestId']).order_by('mobileNumber'):
#         msg_club_delivery_report_list.append(MsgClubDeliveryReportModelSerializer(msg_club_delivery_report_object).data)
#
#     return msg_club_delivery_report_list
#
#
# def handle_msg_club_delivery_report(data):
#     for status in data:
#         report = {
#             'requestId': status['requestId'],
#             'mobileNumber': int(status['mobileNumber'][2:]),
#             'status': status['status'],
#             'statusCode': status['statusCode'],
#             'deliveredDateTime': status['deliveredDateTime'] + "+05:30",
#             'senderId': status['senderId'],
#         }
#         queryset = MsgClubDeliveryReport.objects.filter(requestId=report['requestId'],
#         mobileNumber=report['mobileNumber'])
#         if queryset.count() > 0:
#             report['id'] = queryset[0].id
#             update_msg_club_delivery_report(report)
#         else:
#             create_msg_club_delivery_report(report)
#
#
# def update_msg_club_delivery_report(data):
#
#     object = MsgClubDeliveryReportModelSerializer(MsgClubDeliveryReport.objects.get(id=data['id']),data=data)
#     if object.is_valid():
#         object.save()
#         return 'Msg Club Delivery Report updated successfully'
#     else:
#         print('Msg Club Delivery Report updation failed')
#         return 'Msg Club Delivery Report updation failed'
#
#
# def create_msg_club_delivery_report(data):
#
#     msg_club_delivery_report_object = MsgClubDeliveryReportModelSerializer(data=data)
#     if msg_club_delivery_report_object.is_valid():
#         msg_club_delivery_report_object.save()
#         return 'Msg Club Delivery Report recorded successfully'
#     else:
#         print('Msg Club Delivery Report recording failed')
#         return 'Msg Club Delivery Report recording failed'
