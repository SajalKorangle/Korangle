from sms_app.models import SMSDeliveryReport

from rest_framework import serializers


class SMSDeliveryReportModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = SMSDeliveryReport
        fields = '__all__'


def get_sms_delivery_report_list(data):
    sms_delivery_report_list = []

    for msg_club_delivery_report_object in \
            SMSDeliveryReport.objects.filter(requestId=data['requestId']).order_by('mobileNumber'):
        sms_delivery_report_list.append(SMSDeliveryReportModelSerializer(msg_club_delivery_report_object).data)

    return sms_delivery_report_list


def handle_sms_delivery_report(data):
    for status in data:
        report = {
            'mobileNumber': int(status['Number']),
            'status': status['status'],
            'deliveredDateTime': status['Delivered Date'],
            'senderId': status['SenderId']
        }
        queryset = SMSDeliveryReportModelSerializer.objects.filter(requestId=report['requestId'],
                                                                   mobileNumber=report['mobileNumber'])
        if queryset.count() > 0:
            report['id'] = queryset[0].id
            update_sms_delivery_report(report)
        else:
            create_sms_delivery_report(report)


def update_sms_delivery_report(data):
    object = SMSDeliveryReportModelSerializer(SMSDeliveryReport.objects.get(id=data['id']), data=data)
    if object.is_valid():
        object.save()
        return 'Msg Club Delivery Report updated successfully'
    else:
        print('Msg Club Delivery Report updation failed')
        return 'Msg Club Delivery Report updation failed'


def create_sms_delivery_report(data):
    msg_club_delivery_report_object = SMSDeliveryReportModelSerializer(data=data)
    if msg_club_delivery_report_object.is_valid():
        msg_club_delivery_report_object.save()
        return 'Msg Club Delivery Report recorded successfully'
    else:
        print('Msg Club Delivery Report recording failed')
        return 'Msg Club Delivery Report recording failed'
