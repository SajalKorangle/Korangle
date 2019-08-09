from django.http import JsonResponse
from rest_framework.decorators import api_view

from rest_framework.views import APIView

from decorators import user_permission

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
    message_response['medssage'] = message
    return message_response


########### User ###########
from .business.user import get_user_list


class UserView(APIView):

    def get(self, request):
        if request.user.is_authenticated:
            return JsonResponse({'response': get_success_response(get_user_list())})
        else:
            return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})


########### Module ###########
from .business.module import get_school_module_list, get_latest_module_list, get_module_list


class ModuleView(APIView):

    def get(self, request, school_id):
        if request.user.is_authenticated:
            data = {
                'schoolDbId': school_id,
            }
            return JsonResponse({'response': get_success_response(get_school_module_list(data))})
        else:
            return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})


class ModuleListView(APIView):

    @user_permission
    def get(request):
        if 'latest' in request.GET:
            return get_latest_module_list()
        else:
            return get_module_list()


########### Access ###########
from .business.access import create_access_batch


class AccessListView(APIView):

    @user_permission
    def post(request):
        data = json.loads(request.body.decode('utf-8'))
        return create_access_batch(data)


########### Task ###########
from .business.task import get_task_list


class TaskListView(APIView):

    @user_permission
    def get(request):
        return get_task_list()
