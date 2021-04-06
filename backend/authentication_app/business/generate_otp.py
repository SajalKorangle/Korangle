import http.client
import json

import requests

from random import randint
from datetime import timedelta
from django.utils import timezone

from django.contrib.auth.models import User
from authentication_app.models import OTP


def generate_otp(data):

    payload = {
        'secret': '6LdNiNgZAAAAAGsOxSLZY6MDiuTGJKFMjpngekZV',
        'response': data['captchaToken']
    }

    response = requests.post('https://www.google.com/recaptcha/api/siteverify', data=payload)

    if response.json()['success'] == False:
        return {'status': 'failure', 'message': 'Captcha Failed'}

    user_object_list = User.objects.filter(username=data['mobileNumber'])

    if user_object_list.count() != 1:
        return {'status': 'failure', 'message': 'Mobile No. doesn\'t exist in our database'}

    otp_object_list = OTP.objects.filter(mobileNumber=data['mobileNumber'], generationDateTime__gte=timezone.now() - timedelta(minutes=5))

    if otp_object_list.count() > 3:
        return {'status': 'failure', 'message': 'You are only allowed 3 attempts in 5 minutes'}

    number = randint(100000, 999999)

    otp_object = OTP(mobileNumber=data['mobileNumber'], otp=number, action='FORGOT PASSWORD')
    otp_object.save()

    conn = http.client.HTTPConnection("msg.msgclub.net")

    anotherPayload = {
        "smsContent": str(number) + ' is the OTP requested by you to reset your password for korangle.com',
        "routeId": "1",
        "mobileNumbers": data['mobileNumber'],
        "senderId": 'KORNGL',
        "smsContentType": 'english',
    }

    payloadJson = json.dumps(anotherPayload)

    headers = {
        'Content-Type': "application/json",
        'Cache-Control': "no-cache"
    }

    conn.request("POST", "/rest/services/sendSMS/sendGroupSms?AUTH_KEY=fbe5746e5505757b176a1cf914110c3", payloadJson, headers)

    response = conn.getresponse().read()

    requestIdFromMsgClub = str(json.loads(response.decode("utf-8"))['response'])

    return {'status': 'success', 'message': 'OTP generated successfully'}
