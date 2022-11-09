
from django.http import JsonResponse
from rest_framework.decorators import api_view

from common.common_views_3 import CommonListView, CommonView, APIView
from decorators import user_permission

import json

from examination_app.models import Examination, TestSecond, StudentTest, StudentExtraSubField, CCEMarks, StudentExaminationRemarks

from common.common_functions import get_error_response, get_success_message, get_success_response


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
        return get_test_list(request.GET)


########### Student Test #############
from examination_app.business.student_test import get_student_test_list, create_student_test_list,\
    delete_student_test_list, update_student_test_list


class StudentTestListOldView(APIView):

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


########### Student Extra Sub Field #############
from examination_app.business.student_extra_sub_field import get_student_extra_sub_field_list, \
    create_student_extra_sub_field_list, update_student_extra_sub_field_list


class StudentExtraSubFieldOldListView(APIView):

    @user_permission
    def get(request):
        return get_student_extra_sub_field_list(request.GET)

    @user_permission
    def post(request):
        data = json.loads(request.body.decode('utf-8'))
        return create_student_extra_sub_field_list(data)

    @user_permission
    def put(request):
        data = json.loads(request.body.decode('utf-8'))
        return update_student_extra_sub_field_list(data)


########### Mp Board Report Card Mapping #############
from examination_app.business.mp_board_report_card_mapping import get_mp_board_report_card_mapping, \
    create_mp_board_report_card_mapping, update_mp_board_report_card_mapping


class MpBoardReportCardMappingView(APIView):

    @user_permission
    def get(request):
        return get_mp_board_report_card_mapping(request.GET)

    @user_permission
    def post(request):
        data = json.loads(request.body.decode('utf-8'))
        return create_mp_board_report_card_mapping(data)

    @user_permission
    def put(request):
        data = json.loads(request.body.decode('utf-8'))
        return update_mp_board_report_card_mapping(data)


########### CCE Marks #############
from examination_app.business.cce_marks import get_cce_marks_list, create_cce_marks_list,\
    delete_cce_marks_list, update_cce_marks_list


class CCEMarksOldListView(APIView):

    @user_permission
    def get(request):
        return get_cce_marks_list(request.GET)

    @user_permission
    def post(request):
        data = json.loads(request.body.decode('utf-8'))
        return create_cce_marks_list(data)

    @user_permission
    def put(request):
        data = json.loads(request.body.decode('utf-8'))
        return update_cce_marks_list(data)

    @user_permission
    def delete(request, student_test_id_list):
        return delete_cce_marks_list(student_test_id_list)


########### Examination #############


class ExaminationView(CommonView, APIView):
    Model = Examination
    RelationsToSchool = ['parentSchool__id']


class ExaminationListView(CommonListView, APIView):
    Model = Examination
    RelationsToSchool = ['parentSchool__id']

########### Test Second #############


class TestSecondView(CommonView, APIView):
    Model = TestSecond
    RelationsToSchool = ['parentExamination__parentSchool__id']


class TestSecondListView(CommonListView, APIView):
    Model = TestSecond
    RelationsToSchool = ['parentExamination__parentSchool__id']

########### Student Test #############


class StudentTestView(CommonView, APIView):
    Model = StudentTest
    RelationsToSchool = ['parentExamination__parentSchool__id', 'parentStudent__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']


class StudentTestListView(CommonListView, APIView):
    Model = StudentTest
    RelationsToSchool = ['parentExamination__parentSchool__id', 'parentStudent__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']


########### Student Extra Sub Field #############


class StudentExtraSubFieldView(CommonView, APIView):
    Model = StudentExtraSubField
    RelationsToSchool = ['parentExamination__parentSchool__id', 'parentStudent__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']

class StudentExtraSubFieldListView(CommonListView, APIView):
    Model = StudentExtraSubField
    RelationsToSchool = ['parentExamination__parentSchool__id', 'parentStudent__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']

########### CCE Marks #############


class CCEMarksView(CommonView, APIView):
    Model = CCEMarks
    RelationsToSchool = ['parentStudent__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']


class CCEMarksListView(CommonListView, APIView):
    Model = CCEMarks
    RelationsToSchool = ['parentStudent__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']

    
    
########### Remarks #############


class StudentExaminationRemarksView(CommonView, APIView):
    Model = StudentExaminationRemarks
    RelationsToSchool = ['parentExamination__parentSchool__id', 'parentStudent__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']

class StudentExaminationRemarksListView(CommonListView, APIView):
    Model = StudentExaminationRemarks
    RelationsToSchool = ['parentExamination__parentSchool__id', 'parentStudent__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']