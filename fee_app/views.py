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

################ Common ######################
from .handlers.common import get_student_fee_data
@api_view(['POST'])
def get_student_fee_data_view(request):
    if request.user.is_authenticated:
        data = json.loads(request.body.decode('utf-8'))
        return JsonResponse({'response': get_success_response(get_student_fee_data(data, request.user))})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

################ Submit Fee ##################
from .handlers.submit_fee import new_fee_receipt
@api_view(['POST'])
def new_fee_receipt_view(request):
    if request.user.is_authenticated:
        data = json.loads(request.body.decode('utf-8'))
        # return JsonResponse({'response': new_fee_receipt(data, request.user)})
        return JsonResponse({'response': get_success_response(new_fee_receipt(data, request.user))})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

################ Fees List ##################
from .handlers.fees_list import fees_list
@api_view(['POST'])
def fees_list_view(request):
    if request.user.is_authenticated:
        data = json.loads(request.body.decode('utf-8'))
        return JsonResponse({'response': get_success_response(fees_list(data, request.user))})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

################ Give Concession ##################
from .handlers.new_concession import new_concession
@api_view(['POST'])
def new_concession_view(request):
    if request.user.is_authenticated:
        data = json.loads(request.body.decode('utf-8'))
        return JsonResponse({'response': get_success_response(new_concession(data, request.user))})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

################ Concession List ##################
from .handlers.concession_list import concession_list
@api_view(['POST'])
def concession_list_view(request):
    if request.user.is_authenticated:
        data = json.loads(request.body.decode('utf-8'))
        return JsonResponse({'response': get_success_response(concession_list(data, request.user))})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})
