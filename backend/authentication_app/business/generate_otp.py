import http.client
import json

import requests

from random import randint
from datetime import timedelta
from django.utils import timezone

from django.contrib.auth import get_user_model
User = get_user_model()
from authentication_app.models import OTP

# OTP templates for corresponding actions in generate OTP
otpTemplates = {
    'SIGN UP': ' is the OTP requested by you to sign up for korangle.com',
    'FORGOT PASSWORD': ' is the OTP requested by you to reset your password for korangle.com',
    'CREATE SCHOOL': ' is the OTP requested by you to create school for korangle.com'
}


def generate_otp(data):
    return_response = {'status': 'success', 'message': 'OTP generated successfully'}

    # --- Verifying The Captcha Section starts ---

    payload = {
        'secret': '6LdNiNgZAAAAAGsOxSLZY6MDiuTGJKFMjpngekZV',
        'response': data['captchaToken']
    }

    response = requests.post('https://www.google.com/recaptcha/api/siteverify', data=payload)

    if response.json()['success'] == False:
        return {'status': 'failure', 'message': 'Captcha Failed'}

    # --- Verifying The Captcha Section Ends ---


    # ----- Validation of the user mobile number and max OTP limits starts -----

    user_object_list = User.objects.filter(username=data['mobileNumber'])

    if user_object_list.count() != 1 and data['action'] == 'FORGOT PASSWORD':
        return {'status': 'failure', 'message': 'Mobile No. doesn\'t exist in our database'}

    if user_object_list.count() > 0 and data['action'] == 'SIGN UP':
        return {'status': 'failure', 'message': 'Mobile No. already exists in our database'}

    otp_object_list = OTP.objects.filter(mobileNumber=data['mobileNumber'],
                                         generationDateTime__gte=timezone.now() - timedelta(minutes=5))

    if otp_object_list.count() > 3:
        return {'status': 'failure', 'message': 'You are only allowed 3 attempts in 5 minutes'}

    # ----- Validation of the user mobile number and max OTP limits ends -----

    # ----- Preparing Return Data for Create School Starts -----

    # if user already exists and the action is create school, we are adding the user details in response
    # that is why the return_response in initialized at the beginning
    if user_object_list.count() > 0 and data['action'] == 'CREATE SCHOOL':
        return_response['existingUser'] = {'first_name': user_object_list[0].first_name,
                                           'last_name': user_object_list[0].last_name,
                                           'email': user_object_list[0].email}

    # ----- Preparing Return Data for Create School Ends -----

    # ------- Creation and Sending of OTP starts --------
    number = randint(100000, 999999)
    # Here action can be : (SIGN UP) (FORGOT PASSWORD) (CREATE SCHOOL)
    otp_object = OTP(mobileNumber=data['mobileNumber'], otp=number, action=data['action'])
    otp_object.save()

    conn = http.client.HTTPConnection("msg.msgclub.net")

    anotherPayload = {
        "smsContent": str(number) + otpTemplates[data['action']],
        "routeId": "1",
        "mobileNumbers": data['mobileNumber'],
        "senderId": 'KRANGL',
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

    # ------- Creation and Sending of OTP Ends --------

    return return_response
