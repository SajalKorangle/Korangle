
from django.http import JsonResponse
from rest_framework.decorators import api_view

from decorators import user_permission

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



########### Examination #############
from examination_app.business.examination import get_examination_list, create_examination, update_examination


class ExaminationView(APIView):

    @user_permission
    def post(request):
        data = json.loads(request.body.decode('utf-8'))
        return create_examination(data)

    @user_permission
    def put(request):
        data = json.loads(request.body.decode('utf-8'))
        return update_examination(data)


class ExaminationListView(APIView):

    @user_permission
    def get(request):
        data = {
            'sessionId': request.GET['sessionId'],
            'schoolId': request.GET['schoolId'],
        }
        return get_examination_list(data)


########### Test #############
from examination_app.business.test import get_test_list, create_test, delete_test, update_test


class TestView(APIView):

    @user_permission
    def post(request):
        data = json.loads(request.body.decode('utf-8'))
        return create_test(data)

    @user_permission
    def put(request):
        data = json.loads(request.body.decode('utf-8'))
        return update_test(data)

    @user_permission
    def delete(request, test_id):
        return delete_test(test_id)


class TestListView(APIView):

    @user_permission
    def get(request):
        if 'examinationList' in request.GET:
            return get_test_list(request.GET)
        else:
            if 'schoolId' in request.GET and 'sessionId' in request.GET:
                data = {
                    'schoolId': request.GET['schoolId'],
                    'sessionId': request.GET['sessionId'],
                }
            elif 'examinationId' in request.GET and 'classId' in request.GET and 'sectionId' in request.GET:
                data = {
                    'examinationId': request.GET['examinationId'],
                    'classId': request.GET['classId'],
                    'sectionId': request.GET['sectionId'],
                }
            return get_test_list(data)


########### Student Test #############
from examination_app.business.student_test import get_student_test_list, create_student_test_list,\
    delete_student_test_list, update_student_test_list


class StudentTestListView(APIView):

    @user_permission
    def get(request):
        return get_student_test_list(request.GET)

    @user_permission
    def post(request):
        data = json.loads(request.body.decode('utf-8'))
        return create_student_test_list(data)

    @user_permission
    def put(request):
        data = json.loads(request.body.decode('utf-8'))
        return update_student_test_list(data)

    @user_permission
    def delete(request, student_test_id_list):
        return delete_student_test_list(student_test_id_list)