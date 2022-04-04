import json

from django.views import View
from django.http import JsonResponse
from datetime import timedelta
from django.utils import timezone

from authentication_app.business.generate_otp import generate_otp

from authentication_app.models import OTP
from django.contrib.auth import get_user_model

from employee_app.models import EmployeePermission, Employee
from school_app.business.school_profile import create_school_profile

from team_app.models import Task

from employee_app.business.employee_profile import create_employee_profile

User = get_user_model()
from decorators import get_success_response

# Create your views here.


# GENERATION OF OTP
class GenerateOTPView(View):

    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        return JsonResponse({'response': get_success_response(generate_otp(data))})


# Verify OTP And Change PASSWORD
class VerifyOTPAndChangePasswordView(View):

    def post(self, request):

        data = json.loads(request.body.decode('utf-8'))

        # ------  Verifying OTP Starts ------- #
        otp_object_list = OTP.objects.filter(mobileNumber=data['mobileNumber'],
                                             otp=data['otp'],
                                             action='FORGOT PASSWORD',
                                             generationDateTime__gte=timezone.now() - timedelta(minutes=5))

        if otp_object_list.count() > 0:
        # ------  Verifying OTP Ends ------- #

            # ------  Updating User password Starts ------- #
            user = User.objects.get(username=data['mobileNumber'])
            user.set_password(data['password'])
            user.save()
            # ------  Updating User password Ends ------- #
            return JsonResponse({"response": get_success_response({'status': 'success'})})
        else:
            return JsonResponse({"response": get_success_response({'status': 'failure', 'message': 'OTP verification failed'})})



# Verify OTP And SIGN UP
class VerifyOTPAndSignupView(View):

    def post(self, request):

        data = json.loads(request.body.decode('utf-8'))

        # ------  Verifying OTP Starts ------- #
        otp_object_list = OTP.objects.filter(mobileNumber=data['mobileNumber'],
                                             otp=data['otp'],
                                             action='SIGN UP',
                                             generationDateTime__gte=timezone.now() - timedelta(minutes=5))

        if otp_object_list.count() > 0:
        # ------  Verifying OTP Ends ------- #

            # ------  Creating User Details Starts ------- #
            user = User.objects.create_user(username=data['mobileNumber'],
                                            email=data['email'],
                                            password=data['password'],
                                            first_name=data['first_name'],
                                            last_name=data['last_name'])
            user.save()

            # ------  Verifying User Details Ends ------- #
            return JsonResponse({"response": get_success_response({'status': 'success'})})
        else:
            return JsonResponse(
                {"response": get_success_response({'status': 'failure', 'message': 'OTP verification failed'})})



# Verify OTP And Create School
class VerifyOTPAndCreateSchool(View):
    def post(self, request):

        data = json.loads(request.body.decode('utf-8'))

        # ------  Verifying OTP Starts ------- #

        otp_object_list = OTP.objects.filter(mobileNumber=data['mobileNumber'],
                                             otp=data['otp'],
                                             action='CREATE SCHOOL',
                                             generationDateTime__gte=timezone.now() - timedelta(minutes=5))


        if otp_object_list.count() > 0:
        # ------  Verifying OTP Ends ------- #

            # ------  Verifying User Details Starts ------- #
            if data['userExists'] is False:
                user = User.objects.create_user(username=data['mobileNumber'],
                                                email=data['email'],
                                                password=data['password'],
                                                first_name=data['first_name'],
                                                last_name=data['last_name'])
                user.save()
            else:
                user = User.objects.get(username=data['mobileNumber'])
                if user.check_password(data['password']) is False:
                    return JsonResponse({"response": get_success_response({'status': 'failure',
                                                                           'message': 'Invalid Password'})})
            # ------  Verifying User Details Ends ------- #

        # ------  Creating School Section Starts ------- #
            school_data = create_school_profile(data['schoolDetails'])

            # ------  Creating Employee And Employee Perm for the user Section Starts ------- #
            employee_details = {
                'name': data['first_name'] + ' ' + data['last_name'],
                'fatherName': '-',
                'mobileNumber': data['mobileNumber'],
                'parentSchool': school_data['id'],
                'dateOfBirth': None,
                'dateOfJoining': None,
                'dateOfLeaving': None,
            }
            employee_data = create_employee_profile(employee_details)
            task_list = Task.objects.filter(parentBoard=None, parentModule__parentBoard=None)
            employee = Employee.objects.get(id=employee_data['id'])

            for task in task_list:
                EmployeePermission.objects.create(parentEmployee=employee,
                                                  parentTask=task)

            # ------  Creating Employee And Employee Perm for the user Section Ends ------- #

        # ------  Creating School Section Ends ------- #

            return JsonResponse({"response": get_success_response({'status': 'success'})})
        else:
            return JsonResponse(
                {"response": get_success_response({'status': 'failure', 'message': 'OTP verification failed'})})
