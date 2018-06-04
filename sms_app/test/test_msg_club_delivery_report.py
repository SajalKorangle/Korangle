
from parent_test import ParentTestCase

import datetime

# Factory
from sms_app.factory.msg_club_delivery_report import MsgClubDeliveryReportFactory

# Business
from sms_app.business.msg_club_delivery_report \
    import create_msg_club_delivery_report, handle_msg_club_delivery_report, get_msg_club_delivery_report_list

# Model
from sms_app.models import MsgClubDeliveryReport


class MsgClubDeliveryReportTestCase(ParentTestCase):

    def test_get_msg_club_delivery_report_list(self):

        msg_club_delivery_report_list = []

        msg_club_delivery_report_list.extend(MsgClubDeliveryReportFactory.create_batch(3, requestId='okay'))

        data = {
            'requestId': 'okay',
        }

        response = get_msg_club_delivery_report_list(data)

        self.assertEqual(len(response), 3)

        index = 0
        for msg in msg_club_delivery_report_list:
            report_response = response[index]
            self.assertEqual(report_response['id'], msg.id)
            index += 1

    def test_handle_msg_club_delivery_report(self):

        data = [
            {
                "requestId": "6eaa111d46004cbf8d49bc5eb5b55793",
                "mobileNumber": "919999999999",
                "status": "Delivered",
                "deliveredDateTime": "2014-09-23 07:03:33",
                "statusCode": "4001",
                "senderId": "MSGTST"
            },

            {
                "requestId": "6eaa111d46004cbf8d49bc5eb5b55793",
                "mobileNumber": "918888888888",
                "status": "Delivered",
                "deliveredDateTime": "2014-09-23 07:03:33",
                "statusCode": "4001",
                "senderId": "MSGTST"
            }
        ]

        handle_msg_club_delivery_report(data)

        for status in data:
            MsgClubDeliveryReport.objects.get(requestId=status['requestId'],
                                              mobileNumber=int(status['mobileNumber'][2:]),
                                              status=status['status'],
                                              statusCode=status['statusCode'],
                                              deliveredDateTime=status['deliveredDateTime'] + "+05:30",
                                              senderId=status['senderId'])

    def test_create_msg_club_delivery_report(self):

        data = {
            'requestId': 'okay',
            'mobileNumber': 7999951154,
            'status': "Delivered",
            'statusCode': "4001",
            'deliveredDateTime': "2014-09-23 07:03:33+05:30",
            'senderId': 'KORNGL',
        }

        create_msg_club_delivery_report(data)

        MsgClubDeliveryReport.objects.get(requestId=data['requestId'],
                                          mobileNumber=data['mobileNumber'],
                                          status=data['status'],
                                          statusCode=data['statusCode'],
                                          deliveredDateTime=data['deliveredDateTime'],
                                          senderId=data['senderId'])
