from django.http import JsonResponse
from rest_framework.decorators import api_view

from rest_framework.views import APIView

import json

import datetime


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


################# Fee Type ##########################
from .business.fee_type import get_fee_type_list


class FeeTypeView(APIView):

    def get(self, request):
        if request.user.is_authenticated:
            return JsonResponse({'response': get_success_response(get_fee_type_list())})
        else:
            return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})


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


################# School Fee Type ###################
from .business.school_fee_definition import add_fee_definition, get_fee_definition_list_by_school_id


class FeeDefinitionView(APIView):

    def get(self, request, school_id):
        if request.user.is_authenticated:
            data = {}
            data['schoolDbId'] = school_id
            data['sessionDbId'] = request.GET['session_id']
            return JsonResponse({'response': get_success_response(get_fee_definition_list_by_school_id(data))})
        else:
            return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

    def post(self, request):
        if request.user.is_authenticated:
            data = json.loads(request.body.decode('utf-8'))
            return JsonResponse({'response': get_success_response(add_fee_definition(data))})
        else:
            return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})


################# Student Fee Status ################
from .business.student_fee_status import get_student_fee_status_list, get_student_fee_status, update_student_fee_status


class StudentFeeStatusView(APIView):

    def get(self, request, student_id):
        if request.user.is_authenticated:
            data = {}
            data['studentDbId'] = student_id
            if 'session_id' in request.GET:
                data['sessionDbId'] = request.GET['session_id']
                return JsonResponse({'response': get_success_response(get_student_fee_status(data))})
            else:
                return JsonResponse({'response': get_success_response(get_student_fee_status_list(data))})
        else:
            return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

    def post(self, request, student_id):
        if request.user.is_authenticated:
            data = json.loads(request.body.decode('utf-8'))
            # data['studentDbId'] = student_id
            return JsonResponse({'response': get_success_response(update_student_fee_status(data))})
        else:
            return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})


################# Fee Receipts ################
from .business.fee_receipt import create_fee_receipt, get_fee_receipt_list_by_student_id, get_fee_receipt_list_by_school_id


class StudentFeeReceiptView(APIView):

    def get(self, request, student_id):
        if request.user.is_authenticated:
            data = {}
            data['studentDbId'] = student_id
            return JsonResponse({'response': get_success_response(get_fee_receipt_list_by_student_id(data))})
        else:
            return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

    def post(self, request, student_id):
        if request.user.is_authenticated:
            data = json.loads(request.body.decode('utf-8'))
            return JsonResponse({'response': get_success_response(create_fee_receipt(data))})
        else:
            return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})


class SchoolFeeReceiptView(APIView):

    def get(self, request, school_id):
        if request.user.is_authenticated:
            data = {}
            data['schoolDbId'] = school_id
            if 'startDate' in request.GET:
                data['startDate'] = request.GET['startDate']
            else:
                data['startDate'] = '2016-04-01'
            if 'endDate' in request.GET:
                data['endDate'] = request.GET['endDate']
            else:
                data['endDate'] = datetime.date
            return JsonResponse({'response': get_success_response(get_fee_receipt_list_by_school_id(data))})
        else:
            return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

################# Concessions ################
from .business.concession import create_concession, get_concession_list_by_student_id, get_concession_list_by_school_id


class StudentConcessionView(APIView):

    def get(self, request, student_id):
        if request.user.is_authenticated:
            data = {}
            data['studentDbId'] = student_id
            return JsonResponse({'response': get_success_response(get_concession_list_by_student_id(data))})
        else:
            return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

    def post(self, request, student_id):
        if request.user.is_authenticated:
            data = json.loads(request.body.decode('utf-8'))
            return JsonResponse({'response': get_success_response(create_concession(data))})
        else:
            return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})


class SchoolConcessionView(APIView):

    def get(self, request, school_id):
        if request.user.is_authenticated:
            data = {}
            data['schoolDbId'] = school_id
            if 'startDate' in request.GET:
                data['startDate'] = request.GET['startDate']
            else:
                data['startDate'] = '2016-04-01'
            if 'endDate' in request.GET:
                data['endDate'] = request.GET['endDate']
            else:
                data['endDate'] = datetime.date
            return JsonResponse({'response': get_success_response(get_concession_list_by_school_id(data))})
        else:
            return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})
