from .models import Expense

from django.http import JsonResponse

from rest_framework.decorators import api_view

import json

def get_error_response(message):
    error_response = {}
    error_response['status'] = 'fail'
    error_response['message'] = message
    return error_response

def get_message_response(message):
    message_response = {}
    message_response['status'] = 'success'
    message_response['message'] = message
    return message_response

from .handlers.new_expense import new_expense
@api_view(['POST'])
def new_expense_view(request):
    if request.user.is_authenticated:
        data = json.loads(request.body.decode('utf-8'))
        return new_expense(request.user,data)

        '''if Expense.objects.filter(voucherNumber=expense['voucherNumber'], parentUser=request.user):
            return JsonResponse({'data': get_error_response('Failed: Voucher Number already Exists')})
        expense_object = Expense.objects.create(voucherNumber=expense['voucherNumber'],
                                                amount=expense['amount'],
                                                remark=expense['remark'],
                                                parentUser=request.user)
        return JsonResponse({'data': get_message_response('Expense submitted successfully')})'''
    else:
        errResponse = {}
        errResponse['status'] = 'fail'
        errResponse['message'] = 'User not authenticated, logout and login again.'
        return JsonResponse({'data': errResponse})


@api_view(['POST'])
def expense_list_date_wise_view(request):
	if request.user.is_authenticated:
		expense_list = []
		time_period = json.loads(request.body.decode('utf-8'))
		expense_query = Expense.objects.filter(generationDateTime__gte=time_period['startDate'],generationDateTime__lte=time_period['endDate'],parentUser=request.user)
		for expense in expense_query:
			tempExpense = {}
			tempExpense['voucherNumber'] = expense.voucherNumber
			tempExpense['amount'] = expense.amount
			tempExpense['generationDateTime'] = expense.generationDateTime
			tempExpense['remark'] = expense.remark
			expense_list.append(tempExpense)
		return JsonResponse({'data':expense_list})
	else:
		return JsonResponse({'data':'error'})

