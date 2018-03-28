
from django.http import JsonResponse
from rest_framework.decorators import api_view

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

################ Working Days ##################
from .handlers.working_days import get_working_days, create_working_days, update_working_days
@api_view(['GET'])
def get_working_days_view(request, school_id, session_id):
    if request.user.is_authenticated:
        data = {}
        data['schoolDbId'] = school_id
        data['sessionDbId'] = session_id
        return JsonResponse({'response': get_success_response(get_working_days(data))})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

@api_view(['POST'])
def create_working_days_view(request):
    if request.user.is_authenticated:
        data = json.loads(request.body.decode('utf-8'))
        return JsonResponse({'response': get_success_response(create_working_days(data))})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

@api_view(['PUT'])
def update_working_days_view(request, school_session_id):
    if request.user.is_authenticated:
        data = json.loads(request.body.decode('utf-8'))
        data['schoolSessionDbId'] = school_session_id
        return JsonResponse({'response': get_success_message(update_working_days(data))})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})
