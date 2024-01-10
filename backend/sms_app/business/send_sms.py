import http.client

from sms_app.business.sms_count import get_sms_count
from school_app.model.models import School
from sms_app.models import SMSId, SMSTemplate
import json

def is_school_sms_balance_low(instance_dict):

    sms_count = get_sms_count(instance_dict['parentSchool_id'])

    # instance is already generated so we just need to check whether sms count has gone below zero
    if sms_count['count'] < 0:
        return True
    else:
        return False


def send_sms_via_smsgatewayhub(instance_dict):

    if is_school_sms_balance_low(instance_dict):
        return {'remark': 'INSUFFICIENT BALANCE', 'requestId': -1, 'mobileNumberContentJson': instance_dict['mobileNumberContentJson'], 'payload': None, 'response': None}

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
    errorMessage = json.loads(response.decode("utf-8"))['ErrorMessage']

    for data in message_data:
        for num in sent_sms_num_list:
            if str(data["Number"]) == "91" + str(num["Number"]):
                num["MessageId"] = data["MessageId"]

    job_id = str(json.loads(response.decode("utf-8"))['JobId'])

    return {
        'remark': errorMessage,
        'requestId': job_id,
        'mobileNumberContentJson': sent_sms_num_list,
        'payload': pay_load,
        'response': response
    }


def send_sms_via_msgclub(instance_dict):

    if is_school_sms_balance_low(instance_dict):
        return {'remark': 'INSUFFICIENT BALANCE', 'requestId': -1, 'mobileNumberContentJson': instance_dict['mobileNumberContentJson'], 'payload': None, 'response': None}

    sms_id_object = SMSId.objects.get(id=instance_dict['parentSMSId_id'])
    sms_template_object = SMSTemplate.objects.get(id=instance_dict['parentSMSTemplate_id'])

    conn = http.client.HTTPConnection("msg.msgclub.net")

    sent_sms_num_list = json.loads(instance_dict['mobileNumberContentJson'])

    headers = {
        'Content-Type': "application/json",
        'Cache-Control': "no-cache"
    }

    pay_load = {
        "routeId": "1",
        "sentSmsNumList": list(map(lambda x: { "mobileNumber": x['Number'], "isAdvanceSms": x['Text'] }, sent_sms_num_list)),
        "senderId": sms_id_object.smsId,
        "smsContentType": "unicode" if instance_dict['contentType'] == '8' else "english",
        "entityid": sms_id_object.entityRegistrationId,
        "templateid": sms_template_object.templateId,
    }

    if instance_dict['scheduledDateTime'] is not None:
        pay_load["scheduleddate"] = instance_dict['scheduledDateTime'].strftime('%d/%m/%Y %H:%M')

    pay_load_json = json.dumps(pay_load)

    conn.request("POST", "/rest/services/sendSMS/v2/sendCustomGroupSms?AUTH_KEY=fbe5746e5505757b176a1cf914110c3", pay_load_json, headers)

    response = json.loads(conn.getresponse().read().decode("utf-8"))

    return {
        'remark': response['responseCode'],
        'requestId': response['response'],
        'mobileNumberContentJson': sent_sms_num_list,
        'payload': pay_load,
        'response': response
    }

