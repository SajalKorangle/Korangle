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

################ Update Profile ##################
from .handlers.update_profile import get_class_section_student_list
@api_view(['GET'])
def get_class_section_student_list_view(request):
	if request.user.is_authenticated:
		# data = json.loads(request.body.decode('utf-8'))
		return JsonResponse({'response': get_success_response(get_class_section_student_list(request.user))})
	else:
		return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

from .handlers.update_profile import get_student_profile
@api_view(['POST'])
def get_student_profile_view(request):
	if request.user.is_authenticated:
		data = json.loads(request.body.decode('utf-8'))
		return JsonResponse({'response': get_success_response(get_student_profile(data))})
	else:
		return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

from .handlers.update_profile import update_student
@api_view(['POST'])
def update_student_view(request):
	if request.user.is_authenticated:
		data = json.loads(request.body.decode('utf-8'))
		return JsonResponse({'response': get_success_response(update_student(data))})
	else:
		return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

from .handlers.update_profile import delete_student
@api_view(['POST'])
def delete_student_view(request):
	if request.user.is_authenticated:
		data = json.loads(request.body.decode('utf-8'))
		return JsonResponse({'response': get_success_response(delete_student(data))})
	else:
		return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

############### View All #########################
from .handlers.view_all import get_class_section_student_profile_list
@api_view(['GET'])
def get_student_profile_list_and_class_section_list_view(request):
	if request.user.is_authenticated:
		# data = json.loads(request.body.decode('utf-8'))
		return JsonResponse({'response': get_success_response(get_class_section_student_profile_list(request.user))})
	else:
		return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

############### New Student ######################
from .handlers.new_student import create_new_student
@api_view(['POST'])
def create_new_student_view(request):
	if request.user.is_authenticated:
		data = json.loads(request.body.decode('utf-8'))
		return JsonResponse({'response': get_success_response(create_new_student(data,request.user))})
	else:
		return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})

############### Promote Student ##################
from .handlers.promote_student import get_student_list_session_class_wise
@api_view(['POST'])
def get_student_list_session_class_wise_view(request):
	if request.user.is_authenticated:
		data = json.loads(request.body.decode('utf-8'))
		response = get_student_list_session_class_wise(request.user,data)
		return JsonResponse({'data': response})
	else:
		return JsonResponse({'data':'error'})

from .handlers.promote_student import promote_student_list
@api_view(['POST'])
def promote_student_list_view(request):
	if request.user.is_authenticated:
		data = json.loads(request.body.decode('utf-8'))
		response = promote_student_list(request.user,data)
		return JsonResponse({'data': response})
	else:
		return JsonResponse({'data':'error'})
