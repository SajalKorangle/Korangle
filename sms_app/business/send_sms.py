
import requests

from sms_app.business.sms import create_sms
from sms_app.business.sms_count import get_sms_count
from school_app.model.models import School

import json


def send_sms(data):

    print(data['message'].encode('utf-8'))

    sms_count_left = get_sms_count(data)

    if data['estimatedCount'] > sms_count_left['count']:
        return {'status': 'failure', 'count': sms_count_left, 'message': 'Not enough sms left'}

    sms_data = {
        'content': data['message'],
        'estimatedCount': data['estimatedCount'],
        'count': data['estimatedCount'],
        'mobileNumberList': data['mobileNumberList'],
        'parentSchool': data['parentSchool'],
    }

    # create_sms(sms_data)

    school_object = School.objects.get(id=data['parentSchool'])

    # Msg Club

    url = "http://msg.msgclub.net/rest/services/sendSMS/sendGroupSms"

    querystring = {
        "AUTH_KEY": "fbe5746e5505757b176a1cf914110c3",
        "message": data['message'],
        "senderId": school_object.smsId,
        "routeId": "1",
        "mobileNos": data['mobileNumberList'],
        "smsContentType": data['smsContentType'],
    }

    # Msg 91

    '''url = 'http://api.msg91.com/api/sendhttp.php'

    querystring = {
        "authkey": "195270AI0dFV3oYHGC5a6b5eb5",
        "message": data['message'],
        "sender": school_object.smsId,
        "route": "4",
        "mobiles": data['mobileNumberList'],
        "country": "91",
        "smsContentType": data['smsContentType'],
    }

    if data['smsContentType'] == 'unicode':
        querystring['unicode'] = 1'''

    headers = {
        'Cache-Control': "no-cache"
    }

    response = requests.request("GET", url, headers=headers, params=querystring)

    print('Response: ' + response.text)

    if 'response' in response.text:
        sms_data['requestId'] = json.loads(response.text)['response']

    create_sms(sms_data)

    f = open('sms_file', 'a+')
    f.write("'{0}'\n'{1}'\n'{2}'\n".format(response.text, data['estimatedCount'], data['message'].encode('utf-8')))
    f.close()

    return {'status': 'success', 'count': data['estimatedCount'], 'message': 'SMS Sent successfully'}
