
import http.client

from sms_app.business.sms_count import get_sms_count
from school_app.model.models import School

import json

from sms_app.models import SMSId


def send_sms(instance_dict):

        school_object = School.objects.get(id=instance_dict['parentSchool_id'])

        sms_count = get_sms_count(school_object.id)

        if instance_dict['count'] > sms_count['count']:
            return {'remark': 'INSUFFICIENT BALANCE', 'requestId': -1}

        sms_id_object = SMSId.objects.get(id=instance_dict['smsId_id'])

        conn = http.client.HTTPConnection("msg.msgclub.net")

        sent_sms_num_list = json.loads(instance_dict['mobileNumberContentJson'])

        anotherPayload = {
            "routeId": "1",
            "sentSmsNumList": sent_sms_num_list,
            "senderId": sms_id_object.smsId,
            "smsContentType": instance_dict['contentType'],
        }

        if instance_dict['scheduledDateTime'] is not None:
            anotherPayload["scheduleddate"] = instance_dict['scheduledDateTime'].strftime('%d/%m/%Y %H:%M')

        payloadJson = json.dumps(anotherPayload)

        headers = {
            'Content-Type': "application/json",
            'Cache-Control': "no-cache"
        }

        conn.request("POST", "/rest/services/sendSMS/sendCustomGroupSms?AUTH_KEY=fbe5746e5505757b176a1cf914110c3",
                     payloadJson, headers)

        response = conn.getresponse().read()

        requestIdFromMsgClub = str(json.loads(response.decode("utf-8"))['response'])

        return {'remark': 'SUCCESS', 'requestId': requestIdFromMsgClub}
