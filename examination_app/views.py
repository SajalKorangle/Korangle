
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

################ Maximum Marks Allowed ##################
from .handlers.maximumMarksAllowed import get_maximumMarksAllowed
@api_view(['GET'])
def get_maximumMarksAllowed_view(request):
    if request.user.is_authenticated:
        return JsonResponse({'response': get_success_response(get_maximumMarksAllowed())})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

################ Marksheet ##################
from .handlers.marksheet import get_marksheet
@api_view(['GET'])
def get_marksheet_view(request, section_id, student_id):
    if request.user.is_authenticated:
        data = {}
        data['sectionDbId'] = section_id
        data['studentDbId'] = student_id
        return JsonResponse({'response': get_success_response(get_marksheet(data))})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

################ Result ##################
from .handlers.result import get_section_student_result, create_student_result
@api_view(['GET'])
def get_section_student_result_view(request, section_id, student_id):
    if request.user.is_authenticated:
        data = {}
        data['sectionDbId'] = section_id
        data['studentDbId'] = student_id
        return JsonResponse({'response': get_success_response(get_section_student_result(data))})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

@api_view(['POST'])
def create_student_result_view(request):
    if request.user.is_authenticated:
        data = json.loads(request.body.decode('utf-8'))
        return JsonResponse({'response': get_success_message(create_student_result(data))})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})
