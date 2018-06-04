
from sms_app.models import MsgClubDeliveryReport

from rest_framework import serializers


class MsgClubDeliveryReportModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = MsgClubDeliveryReport
        fields = '__all__'


def get_msg_club_delivery_report_list(data):

    msg_club_delivery_report_list = []

    for msg_club_delivery_report_object in \
            MsgClubDeliveryReport.objects.filter(requestId=data['requestId']).order_by('mobileNumber'):
        msg_club_delivery_report_list.append(MsgClubDeliveryReportModelSerializer(msg_club_delivery_report_object).data)

    return msg_club_delivery_report_list


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
        queryset = MsgClubDeliveryReport.objects.filter(requestId=report['requestId'], mobileNumber=report['mobileNumber'])
        if queryset.count() > 0:
            report['id'] = queryset[0].id
            update_msg_club_delivery_report(report)
        else:
            create_msg_club_delivery_report(report)


def update_msg_club_delivery_report(data):

    object = MsgClubDeliveryReportModelSerializer(MsgClubDeliveryReport.objects.get(id=data['id']),data=data)
    if object.is_valid():
        object.save()
        return 'Msg Club Delivery Report updated successfully'
    else:
        print('Msg Club Delivery Report updation failed')
        return 'Msg Club Delivery Report updation failed'


def create_msg_club_delivery_report(data):

    msg_club_delivery_report_object = MsgClubDeliveryReportModelSerializer(data=data)
    if msg_club_delivery_report_object.is_valid():
        msg_club_delivery_report_object.save()
        return 'Msg Club Delivery Report recorded successfully'
    else:
        print('Msg Club Delivery Report recording failed')
        return 'Msg Club Delivery Report recording failed'

