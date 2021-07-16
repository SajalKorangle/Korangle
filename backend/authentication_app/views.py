
import json

from django.views import View
from django.http import JsonResponse
from datetime import timedelta
from django.utils import timezone

from authentication_app.business.generate_otp import generate_otp
from authentication_app.business.generate_otp_for_signup import generate_otp_for_signup

from authentication_app.models import OTP
from django.conf import settings
User = settings.AUTH_USER_MODEL
from decorators import get_success_response

# Create your views here.


# OTP


class GenerateOTPView(View):

    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        return JsonResponse({'response': get_success_response(generate_otp(data))})


# Verify OTP
class VerifyOTPView(View):

    def post(self, request):

        data = json.loads(request.body.decode('utf-8'))

        otp_object_list = OTP.objects.filter(mobileNumber=data['mobileNumber'],
                                             otp=data['otp'],
                                             action='FORGOT PASSWORD',
                                             generationDateTime__gte=timezone.now() - timedelta(minutes=5))

        if otp_object_list.count() > 0:
            user = User.objects.get(username=data['mobileNumber'])
            user.set_password(data['password'])
            user.save()
            return JsonResponse({"response": get_success_response({'status': 'success'})})
        else:
            return JsonResponse({"response": get_success_response({'status': 'failure', 'message': 'OTP verification failed'})})


class GenerateOTPForSignupView(View):

    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        return JsonResponse({'response': get_success_response(generate_otp_for_signup(data))})


# Verify OTP
class VerifyOTPForSignupView(View):

    def post(self, request):

        data = json.loads(request.body.decode('utf-8'))

        otp_object_list = OTP.objects.filter(mobileNumber=data['mobileNumber'],
                                             otp=data['otp'],
                                             action='SIGN UP',
                                             generationDateTime__gte=timezone.now() - timedelta(minutes=5))

        if otp_object_list.count() > 0:
            user = User.objects.create_user(username=data['mobileNumber'],
                                            email=data['email'],
                                            password=data['password'],
                                            first_name=data['first_name'],
                                            last_name=data['last_name'])
            user.save()
            return JsonResponse({"response": get_success_response({'status': 'success'})})
        else:
            return JsonResponse({"response": get_success_response({'status': 'failure', 'message': 'OTP verification failed'})})

