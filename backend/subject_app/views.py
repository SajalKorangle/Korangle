from django.http import JsonResponse
from rest_framework.decorators import api_view

from django.shortcuts import render

from rest_framework.views import APIView

from common.common_views_3 import CommonView, CommonListView
from decorators import user_permission

import json

from subject_app.models import StudentSubject, ClassSubject, SubjectSecond

from common.common_functions import get_error_response, get_success_message


from subject_app.handlers.subject_list import subject_list
############ Subjects List #############
@api_view(['GET'])
def get_subjects_view(request):
    if request.user.is_authenticated:
        return JsonResponse({'response': get_success_response(subject_list())})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})




########## SubjectListView ##############
from subject_app.business.subject import get_subject_list


class SubjectOldListView(APIView):

    @user_permission
    def get(request):
        return get_subject_list()


######### ClassSubjectView #############
from subject_app.business.class_subject import create_class_subject, update_class_subject, delete_class_subject


class ClassSubjectOldView(APIView):

    @user_permission
    def post(request):
        data = json.loads(request.body.decode('utf-8'))
        return create_class_subject(data)

    @user_permission
    def put(request, class_subject_id):
        data = json.loads(request.body.decode('utf-8'))
        return update_class_subject(data)

    @user_permission
    def delete(request, class_subject_id):
        return delete_class_subject(class_subject_id)


######### ClassSubjectListView #########
from subject_app.business.class_subject import get_class_subject_list


class ClassSubjectListOldView(APIView):

    @user_permission
    def get(request):
        return get_class_subject_list(request.GET)


######### StudentSubjectView ##########
from subject_app.business.student_subject import create_student_subject, delete_student_subject


class StudentSubjectOldView(APIView):

    @user_permission
    def post(request):
        data = json.loads(request.body.decode('utf-8'))
        return create_student_subject(data)

    @user_permission
    def delete(request, student_subject_id):
        return delete_student_subject(student_subject_id)


######### StudentSubjectListView ######
from subject_app.business.student_subject import get_student_subject_list, create_student_subject_list, delete_student_subject_list


class StudentSubjectListOldView(APIView):

    @user_permission
    def get(request):
        data = {}
        if 'studentList' in request.GET:
            return get_student_subject_list(request.GET)
        else:
            data['sessionId'] = request.GET['sessionId']
            if 'studentId' in request.GET:
                data['studentId'] = request.GET['studentId']
            else:
                data['schoolId'] = request.GET['schoolId']
            return get_student_subject_list(data)

    @user_permission
    def post(request):
        data = json.loads(request.body.decode('utf-8'))
        return create_student_subject_list(data)

    @user_permission
    def delete(request, student_subject_id_list):
        return delete_student_subject_list(student_subject_id_list)


########### Extra Field #############
from subject_app.business.extra_field import get_extra_field_list


class ExtraFieldListView(APIView):

    @user_permission
    def get(request):
        return get_extra_field_list(request.GET)


########### Extra Sub Field #############
from subject_app.business.extra_sub_field import get_extra_sub_field_list


class ExtraSubFieldListView(APIView):

    @user_permission
    def get(request):
        return get_extra_sub_field_list(request.GET)


########### Subject #############


class SubjectView(CommonView, APIView):
    Model = SubjectSecond


class SubjectListView(CommonListView, APIView):
    Model = SubjectSecond


########### Class Subject #############


class ClassSubjectView(CommonView, APIView):
    Model = ClassSubject
    RelationsToSchool= ['parentSchool__id', 'parentEmployee__parentSchool__id']


class ClassSubjectListView(CommonListView, APIView):
    Model = ClassSubject
    RelationsToSchool= ['parentSchool__id', 'parentEmployee__parentSchool__id']


########### Student Subject #############


class StudentSubjectView(CommonView, APIView):
    Model = StudentSubject
    RelationsToSchool = ['parentStudent__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']


class StudentSubjectListView(CommonListView, APIView):
    Model = StudentSubject
    RelationsToSchool = ['parentStudent__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']


