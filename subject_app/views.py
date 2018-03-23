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

from subject_app.handlers.subject_list import subject_list
############ Subjects List #############
@api_view(['GET'])
def get_subjects_view(request):
    if request.user.is_authenticated:
        return JsonResponse({'response': get_success_response(subject_list())})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

