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


from .handlers.new_student import get_class_section_list
@api_view(['GET'])
def get_class_section_list_view(request):
	if request.user.is_authenticated:
		# data = json.loads(request.body.decode('utf-8'))
		return JsonResponse({'response': get_success_response(get_class_section_list())})
	else:
		return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})
