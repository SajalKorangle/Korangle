import http.client

from sms_app.business.sms_count import get_sms_count
from school_app.model.models import School
from sms_app.models import SMSId
import json


def send_sms(instance_dict):
    school_object = School.objects.get(id=instance_dict['parentSchool_id'])

    sms_count = get_sms_count(school_object.id)

    if instance_dict['count'] > sms_count['count']:
        return {'remark': 'INSUFFICIENT BALANCE', 'requestId': -1, 'mobileNumberContentJson': instance_dict['mobileNumberContentJson']}

    sms_id_object = SMSId.objects.get(id=instance_dict['parentSMSId_id'])

    conn = http.client.HTTPSConnection("www.smsgatewayhub.com")

    sent_sms_num_list = json.loads(instance_dict['mobileNumberContentJson'])

    configurations = {
        "APIkey": "pZD3d2b620aBWzVP5XqD9g",
        "SenderId": sms_id_object.smsId,
        "Channel": "2",
        "DCS": instance_dict['contentType'],
        "SchedTime": None,
        "GroupId": None,
        "EntityId": sms_id_object.entityRegistrationId
    }

    headers = {
        'Content-Type': "application/json",
        'Cache-Control': "no-cache"
    }

    if instance_dict['scheduledDateTime'] is not None:
        configurations["SchedTime"] = instance_dict['scheduledDateTime'].strftime('%Y/%m/%d %H:%M:%S')

    pay_load = {
        "Account": configurations,
        "Messages": sent_sms_num_list
    }

    pay_load_json = json.dumps(pay_load)

    conn.request("POST", "/api/mt/SendSms",
                 pay_load_json, headers)

    response = conn.getresponse().read()

    message_data = json.loads(response.decode("utf-8"))['MessageData']

    for data in message_data:
        for num in sent_sms_num_list:
            if str(data["Number"]) == "91" + str(num["Number"]):
                num["MessageId"] = data["MessageId"]

    job_id = str(json.loads(response.decode("utf-8"))['JobId'])

    return {'remark': 'SUCCESS', 'requestId': job_id, 'mobileNumberContentJson': sent_sms_num_list}
