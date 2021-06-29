from django.http import JsonResponse
from rest_framework.decorators import api_view

from rest_framework.views import APIView

import json

from common.common_views_3 import CommonView, CommonListView
from grade_app.models import Grade, SubGrade, StudentSubGrade

class GradeView(CommonView, APIView):
    Model = Grade
    RelationsToSchool = ['parentSchool__id']

class GradeListView(CommonListView, APIView):
    Model = Grade
    RelationsToSchool = ['parentSchool__id']

class SubGradeView(CommonView,APIView):
    Model = SubGrade
    RelationsToSchool = ['parentGrade__parentSchool__id']

class SubGradeListView(CommonListView,APIView):
    Model = SubGrade
    RelationsToSchool = ['parentGrade__parentSchool__id']

class StudentSubGradeView(CommonView,APIView):
    Model = StudentSubGrade
    RelationsToSchool = ['parentExamination__parentSchool__id', 'parentStudent__parentSchool__id', 'parentSubGrade__parentGrade__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']

class StudentSubGradeListView(CommonListView,APIView):
    Model = StudentSubGrade
    RelationsToSchool = ['parentExamination__parentSchool__id', 'parentStudent__parentSchool__id', 'parentSubGrade__parentGrade__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']