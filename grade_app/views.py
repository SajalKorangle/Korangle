from django.http import JsonResponse
from rest_framework.decorators import api_view

from rest_framework.views import APIView

import json

from common.common_views import CommonView, CommonListView
from decorators import user_permission, user_permission_new
from grade_app.models import Grade, SubGrade, StudentSubGrade

class GradeView(CommonView, APIView):
    Model = Grade

class GradeListView(CommonListView, APIView):
    Model = Grade

class SubGradeView(CommonView,APIView):
    Model = SubGrade

class SubGradeListView(CommonListView,APIView):
    Model = SubGrade

class StudentSubGradeView(CommonView,APIView):
    Model = StudentSubGrade

class StudentSubGradeListView(CommonListView,APIView):
    Model = StudentSubGrade