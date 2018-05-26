from django.http import JsonResponse

from rest_framework.views import APIView

import json


def get_error_response(message):
    error_response = {}
    error_response['status'] = 'fail'
    error_response['message'] = message
    return error_response


def get_success_response(data):
    message_response = {}
    message_response['status'] = 'success'
    message_response['data'] = data
    return message_response


def user_permission(function):
    def wrap(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            data = {'response': get_success_response(function(request, *args, **kwargs))}
            return JsonResponse(data)
        else:
            return JsonResponse(
                {'response': get_error_response('User is not authenticated, logout and login again.')})
    wrap.__doc__ = function.__doc__
    wrap.__name__ = function.__name__
    return wrap


############## Employee Profile ##############
from .business.employee_profile \
    import get_employee_profile, create_employee_profile, delete_employee_profile, \
    update_employee_profile, get_employee_profile_list


class EmployeeProfileView(APIView):

    @user_permission
    def get(request, employee_id):
        data = {
            'id': employee_id,
        }
        return get_employee_profile(data)

    @user_permission
    def post(request):
        data = json.loads(request.body.decode('utf-8'))
        return create_employee_profile(data)

    @user_permission
    def put(request, employee_id):
        data = json.loads(request.body.decode('utf-8'))
        return update_employee_profile(data)

    @user_permission
    def delete(request, employee_id):
        data = {
            'id': employee_id,
        }
        return delete_employee_profile(data)


class EmployeeProfileListView(APIView):

    @user_permission
    def get(request, school_id):
        data = {
            'parentSchool': school_id,
        }
        return get_employee_profile_list(data)


############## Employee Mini Profile ##############
from .business.employee_mini_profile import get_employee_mini_profile_list


class EmployeeMiniProfileView(APIView):

    @user_permission
    def get(request, school_id):
        data = {
            'parentSchool': school_id,
        }
        return get_employee_mini_profile_list(data)
