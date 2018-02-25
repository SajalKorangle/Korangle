from .models import Expense

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

from .handlers.new_expense import new_expense
@api_view(['POST'])
def new_expense_view(request):
    if request.user.is_authenticated:
        data = json.loads(request.body.decode('utf-8'))
        return JsonResponse({'response': get_success_response(new_expense(data))})
    else:
        return JsonResponse({'response': get_error_response('User not authenticated, logout and login again.')})


from .handlers.expense_list_date_wise import expense_list_date_wise
@api_view(['POST'])
def expense_list_date_wise_view(request):
    if request.user.is_authenticated:
        data = json.loads(request.body.decode('utf-8'))
        return JsonResponse({'response': get_success_response(expense_list_date_wise(data))})
    else:
        return JsonResponse({'response': get_error_response('User not authenticated, logout and login again.')})