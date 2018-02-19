from django.views.generic import ListView
# from .school_app.models import Class, Student, Session, SessionClass
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from helloworld_project.settings import PROJECT_ROOT
from django.contrib.auth import authenticate, login, logout

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view

import json

import os

from .handlers.promote_student import get_student_list_session_class_wise, promote_student_list

@api_view(['POST'])
def get_student_list_session_class_wise_view(request):
	if request.user.is_authenticated:
		data = json.loads(request.body.decode('utf-8'))
		response = get_student_list_session_class_wise(request.user,data)
		return JsonResponse({'data': response})
	else:
		return JsonResponse({'data':'error'})

@api_view(['POST'])
def promote_student_list_view(request):
	if request.user.is_authenticated:
		data = json.loads(request.body.decode('utf-8'))
		response = promote_student_list(request.user,data)
		return JsonResponse({'data': response})
	else:
		return JsonResponse({'data':'error'})
