from django.http import JsonResponse
from rest_framework.decorators import api_view

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

def get_success_message(message):
    message_response = {}
    message_response['status'] = 'success'
    message_response['message'] = message
    return message_response


########### User ###########
from .business.user import get_user_list


class UserView(APIView):

    def get(self, request):
        if request.user.is_authenticated:
            return JsonResponse({'response': get_success_response(get_user_list())})
        else:
            return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})


########### Permission ###########
from .business.permission import get_school_member_permission_list, update_permissions


class PermissionView(APIView):

    def get(self, request, school_id, user_id):
        if request.user.is_authenticated:
            data = {
                'schoolDbId': school_id,
                'userDbId': user_id,
            }
            return JsonResponse({'response': get_success_response(get_school_member_permission_list(data))})
        else:
            return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

    def put(self, request, school_id, user_id):
        if request.user.is_authenticated:
            data = {
                'schoolDbId': school_id,
                'userDbId': user_id,
            }
            data['permissionList'] = json.loads(request.body.decode('utf-8'))
            return JsonResponse({'response': get_success_response(update_permissions(data))})
        else:
            return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})


########### Module ###########
from .business.module import get_school_module_list


class ModuleView(APIView):

    def get(self, request, school_id):
        if request.user.is_authenticated:
            data = {
                'schoolDbId': school_id,
            }
            return JsonResponse({'response': get_success_response(get_school_module_list(data))})
        else:
            return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})


########### Member ###########
from .business.member import get_school_member_list, create_member, delete_member


class MemberView(APIView):

    def get(self, request, school_id):
        if request.user.is_authenticated:
            data = {
                'schoolDbId': school_id,
            }
            return JsonResponse({'response': get_success_response(get_school_member_list(data))})
        else:
            return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

    def post(self, request, school_id):
        if request.user.is_authenticated:
            data = json.loads(request.body.decode('utf-8'))
            return JsonResponse({'response': get_success_response(create_member(data))})
        else:
            return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

    def delete(self, request, member_id):
        if request.user.is_authenticated:
            data = {
                'dbId': member_id,
            }
            return JsonResponse({'response': get_success_response(delete_member(data))})
        else:
            return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})
