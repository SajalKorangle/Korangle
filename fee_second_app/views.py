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

#####################################################
################# ALL NEW FEES ######################
#####################################################

################# Fee Structure #####################
from .business.fee_structure import get_fee_structure, create_or_update_fee_structure
@api_view(['GET'])
def fee_structure_view(request, school_id, session_id):
    if request.user.is_authenticated:
        data = {}
        data['schoolDbId'] = school_id
        data['sessionDbId'] = session_id
        return JsonResponse({'response': get_success_response(get_fee_structure(data))})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

@api_view(['POST'])
def fee_structure_view(request, school_id, session_id):
    if request.user.is_authenticated:
        data = json.loads(request.body.decode('utf-8'))
        data['schoolDbId'] = school_id
        data['sessionDbId'] = session_id
        return JsonResponse({'response': get_success_response(create_or_update_fee_structure(data))})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

################# Student Fee Status ################
from .business.student_fee_status import get_student_fee_status, create_or_update_student_fee_status

class StudentFeeStatusView(APIView):

    def get(self, request, student_id):
        if request.user.is_authenticated:
            data = {}
            data['studentDbId'] = student_id
            if 'session_id' in request.GET:
                data['sessionDbId'] = request.GET['session_id']
            return JsonResponse({'response': get_success_response(get_student_fee_status(data))})
        else:
            return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

    def post(request, student_id):
        if request.user.is_authenticated:
            data = json.loads(request.body.decode('utf-8'))
            data['studentDbId'] = student_id
            return JsonResponse({'response': get_success_response(create_or_update_student_fee_status(data))})
        else:
            return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})


"""@api_view(['GET'])
def fee_status_view(request, student_id):
    if request.user.is_authenticated:
        data = {}
        data['studentDbId'] = student_id
        if 'session_id' in request.GET:
            data['sessionDbId'] = request.GET['session_id']
        return JsonResponse({'response': get_success_response(get_student_fee_status(data))})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

@api_view(['POST'])
def fee_status_view(request, student_id, session_id):
    if request.user.is_authenticated:
        data = json.loads(request.body.decode('utf-8'))
        data['studentDbId'] = student_id
        return JsonResponse({'response': get_success_response(create_or_update_student_fee_status(data))})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})"""

################# Fee Receipts ################
from .business.fee_receipt import get_student_fee_receipt, create_fee_receipt, get_school_fee_receipt
@api_view(['GET'])
def student_fee_receipt_view(request, student_id):
    if request.user.is_authenticated:
        data = {}
        data['studentDbId'] = student_id
        return JsonResponse({'response': get_success_response(get_student_fee_receipt(data))})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

@api_view(['POST'])
def student_fee_receipt_view(request, student_id):
    if request.user.is_authenticated:
        data = json.loads(request.body.decode('utf-8'))
        data['studentDbId'] = student_id
        return JsonResponse({'response': get_success_response(create_fee_receipt(data))})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

@api_view(['GET'])
def school_fee_receipt_view(request, school_id):
    if request.user.is_authenticated:
        data = {}
        data['schoolDbId'] = school_id
        data['startDate'] = request.GET['start-date']
        data['endDate'] = request.GET['end-date']
        return JsonResponse({'response': get_success_response(get_school_fee_receipt(data))})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

################# Concessions ################
from .business.concession import get_student_concession, create_concession, get_school_concession
@api_view(['GET'])
def student_concession_view(request, student_id):
    if request.user.is_authenticated:
        data = {}
        data['studentDbId'] = student_id
        return JsonResponse({'response': get_success_response(get_student_concession(data))})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

@api_view(['POST'])
def student_concession_view(request, student_id):
    if request.user.is_authenticated:
        data = json.loads(request.body.decode('utf-8'))
        data['studentDbId'] = student_id
        return JsonResponse({'response': get_success_response(create_concession(data))})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

@api_view(['GET'])
def school_concession_view(request, school_id):
    if request.user.is_authenticated:
        data = {}
        data['schoolDbId'] = school_id
        data['startDate'] = request.GET['start-date']
        data['endDate'] = request.GET['end-date']
        return JsonResponse({'response': get_success_response(get_school_concession(data))})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

