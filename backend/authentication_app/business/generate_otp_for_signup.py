import http.client
import json

import requests

from random import randint
from datetime import timedelta
from django.utils import timezone

from django.contrib.auth.models import User
from authentication_app.models import OTP


def generate_otp_for_signup(data):

    # Checking Captcha
    payload = {
        'secret': '6LeljdgZAAAAAGeOQ-hywPkK8zQfHYP6FpcdhESV',
        'response': data['captchaToken']
    }

    response = requests.post('https://www.google.com/recaptcha/api/siteverify', data=payload)

    if response.json()['success'] == False:
        return {'status': 'failure', 'message': 'Captcha Failed'}


    # Checking if mobile number already exists
    user_object_list = User.objects.filter(username=data['mobileNumber'])

    if user_object_list.count() > 0:
        return {'status': 'failure', 'message': 'Mobile No. already exists in our database'}

    # Stopping OTP Flood
    otp_object_list = OTP.objects.filter(mobileNumber=data['mobileNumber'], generationDateTime__gte=timezone.now() - timedelta(minutes=5))

    if otp_object_list.count() > 3:
        return {'status': 'failure', 'message': 'You are only allowed 3 signup attempts in 5 minutes'}

    # Generating OTP
    number = randint(100000, 999999)

    otp_object = OTP(mobileNumber=data['mobileNumber'], otp=number, action='SIGN UP')
    otp_object.save()

    # Sending OTP SMS
    conn = http.client.HTTPConnection("msg.msgclub.net")

    anotherPayload = {
        "smsContent": str(number) + ' is the OTP requested by you to sign up for korangle.com',
        "routeId": "1",
        "mobileNumbers": data['mobileNumber'],
        "senderId": 'TBTSIG',
        "smsContentType": 'english',
    }

    payloadJson = json.dumps(anotherPayload)

    headers = {
        'Content-Type': "application/json",
        'Cache-Control': "no-cache"
    }

    conn.request("POST", "/rest/services/sendSMS/sendGroupSms?AUTH_KEY=fbe5746e5505757b176a1cf914110c3", payloadJson, headers)

    response = conn.getresponse().read()

    return {'status': 'success', 'message': 'OTP generated successfully'}
