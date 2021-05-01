
import http.client

import requests

from sms_app.business.sms import create_sms
from sms_app.business.sms_count import get_sms_count
from school_app.model.models import School

import json


# def send_sms(data):
# 
#     sms_count_left = get_sms_count(data)
# 
#     if data['count'] > sms_count_left['count']:
#         return {'status': 'failure', 'count': sms_count_left['count'], 'message': 'Not enough sms left'}
# 
#     school_object = School.objects.get(id=data['parentSchool'])
# 
#     conn = http.client.HTTPConnection("msg.msgclub.net")
# 
#     anotherPayload = {
#         "smsContent": data['content'],
#         "routeId": "1",
#         "mobileNumbers": data['mobileNumberList'],
#         "senderId": school_object.smsId,
#         "smsContentType": data['contentType'],
#     }
# 
#     payloadJson = json.dumps(anotherPayload)
# 
#     headers = {
#         'Content-Type': "application/json",
#         'Cache-Control': "no-cache"
#     }
# 
#     conn.request("POST", "/rest/services/sendSMS/sendGroupSms?AUTH_KEY=fbe5746e5505757b176a1cf914110c3", payloadJson, headers)
# 
#     response = conn.getresponse().read()
# 
#     requestIdFromMsgClub = str(json.loads(response.decode("utf-8"))['response'])
# 
#     return {'status': 'success', 'requestId': requestIdFromMsgClub, 'message': 'SMS Sent successfully'}
# 
# 
# def send_sms_old(data):
# 
#     # print(data['message'].encode('utf-8'))
# 
#     sms_count_left = get_sms_count(data)
# 
#     if data['estimatedCount'] > sms_count_left['count']:
#         return {'status': 'failure', 'count': sms_count_left['count'], 'message': 'Not enough sms left'}
# 
#     sms_data = {
#         'content': data['message'],
#         'estimatedCount': data['estimatedCount'],
#         'count': data['estimatedCount'],
#         'mobileNumberList': data['mobileNumberList'][:-1],
#         'parentSchool': data['parentSchool'],
#     }
# 
#     # create_sms(sms_data)
# 
#     school_object = School.objects.get(id=data['parentSchool'])
# 
#     # Msg Club
# 
#     # url = "http://msg.msgclub.net/rest/services/sendSMS/sendGroupSms"
# 
#     '''querystring = {
#         "AUTH_KEY": "fbe5746e5505757b176a1cf914110c3",
#         "message": data['message'],
#         "senderId": school_object.smsId,
#         "routeId": "1",
#         "mobileNos": data['mobileNumberList'],
#         "smsContentType": data['smsContentType'],
#     }'''
# 
#     # Msg 91
# 
#     '''url = 'http://api.msg91.com/api/sendhttp.php'
# 
#     querystring = {
#         "authkey": "195270AI0dFV3oYHGC5a6b5eb5",
#         "message": data['message'],
#         "sender": school_object.smsId,
#         "route": "4",
#         "mobiles": data['mobileNumberList'],
#         "country": "91",
#         "smsContentType": data['smsContentType'],
#     }
# 
#     if data['smsContentType'] == 'unicode':
#         querystring['unicode'] = 1'''
# 
#     '''headers = {
#         'Cache-Control': "no-cache"
#     }'''
# 
#     conn = http.client.HTTPConnection("msg.msgclub.net")
# 
#     # mobileNumberList = data['mobileNumberList'].replace(',',',')[:-1]
# 
#     anotherPayload = {
#         "smsContent": data['message'],
#         "routeId": "1",
#         "mobileNumbers": data['mobileNumberList'][:-1],
#         "senderId": school_object.smsId,
#         "smsContentType": data['smsContentType'],
#     }
# 
#     payloadJson = json.dumps(anotherPayload)
# 
#     # print(payloadJson)
# 
#     # payload = " {\"smsContent\":\""+data['message']+"\",\"routeId\":\"1\",\"mobileNumbers\":\""+mobileNumberList+"\",\"senderId\":\""+school_object.smsId+"\",\"signature\":\"signature\",\"smsContentType\":\""+data['smsContentType']+"\"}"
# 
#     # payload = "{\"smsContent\":\"Hello Test SMS\",\"routeId\":\"1\",\"mobileNumbers\":\"9999999999,8888888888\",\"senderId\":\"DEMOOS\",\"signature\":\"signature\",\"smsContentType\":\"english\"}"
# 
#     # print(payload)
# 
#     headers = {
#         'Content-Type': "application/json",
#         'Cache-Control': "no-cache"
#     }
# 
#     conn.request("POST", "/rest/services/sendSMS/sendGroupSms?AUTH_KEY=fbe5746e5505757b176a1cf914110c3", payloadJson, headers)
# 
#     response = conn.getresponse().read()
# 
#     print(response.decode("utf-8"))
# 
#     requestIdFromMsgClub = str(json.loads(response.decode("utf-8"))['response'])
# 
#     # response = requests.request("GET", url, headers=headers, params=querystring)
# 
#     # print('Response: ' + response.text)
# 
#     # if 'response' in response.text:
#     sms_data['requestId'] = requestIdFromMsgClub # json.loads(response.text)['response']
# 
#     message = create_sms(sms_data)
# 
#     print(message)
# 
#     return {'status': 'success', 'count': data['estimatedCount'], 'message': 'SMS Sent successfully'}
# 
#     # f = open('sms_file', 'a+')
#     # f.write("'{0}'\n'{1}'\n'{2}'\n".format(response.text, data['estimatedCount'], data['message'].encode('utf-8')))
#     # f.close()
# 
# def send_different_sms(data):
#     """
#     Function sends different SMS
#     """
#     sms_count_left = get_sms_count(data)
#     if data['count'] > sms_count_left['count']:
#         return {'status': 'failure', 'count': sms_count_left['count'], 'message': 'Not enough sms left'}
# 
#     # if data['count'] > sms_count['count']:
#     #     return 0
# 
#     sms_id_object = SMSId.objects.get(id=data['smsId_id'])
#     print(sms_id_object.smsId)
# 
#     conn = http.client.HTTPConnection("msg.msgclub.net")
# 
#     mobileNumberContentList = json.loads(data['mobileNumberContentJson'])
# 
#     print(data['mobileNumberContentJson'])
# 
#     anotherPayload = {
#         "routeId": "1",
#         "sentSmsNumList": mobileNumberContentList,
#         "senderId": sms_id_object.smsId,
#         "smsContentType": data['contentType'],
#     }
# 
#     print(anotherPayload)
# 
#     payloadJson = json.dumps(anotherPayload)
# 
#     headers = {
#         'Content-Type': "application/json",
#         'Cache-Control': "no-cache"
#     }
# 
#     conn.request("POST", "/rest/services/sendSMS/sendCustomGroupSms?AUTH_KEY=fbe5746e5505757b176a1cf914110c3", payloadJson, headers)
# 
#     response = conn.getresponse().read()
#     print(response)
# 
#     requestIdFromMsgClub = str(json.loads(response.decode("utf-8"))['response'])
# 
#     return requestIdFromMsgClub
from sms_app.models import SMSId


def send_sms(instance_dict):

        school_object = School.objects.get(id=instance_dict['parentSchool_id'])

        sms_count = get_sms_count(school_object.id)

        if instance_dict['count'] > sms_count['count']:
            return {'remark': 'INSUFFICIENT BALANCE', 'requestId': 0}

        sms_id_object = SMSId.objects.get(id=instance_dict['smsId_id'])
        print(sms_id_object.smsId)

        conn = http.client.HTTPConnection("msg.msgclub.net")

        sent_sms_num_list = json.loads(instance_dict['mobileNumberContentJson'])

        anotherPayload = {
            "routeId": "1",
            "sentSmsNumList": sent_sms_num_list,
            "senderId": sms_id_object.smsId,
            "smsContentType": instance_dict['contentType'],
        }

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
