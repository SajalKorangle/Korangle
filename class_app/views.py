from django.http import JsonResponse
from rest_framework.decorators import api_view

from decorators import user_permission

from common.common_views import CommonView, APIView, CommonListView, APIView
from decorators import user_permission_new
from class_app.models import ClassTeacherSignature

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

############ Classes ###############
from .handlers.classes import get_class_list
class ClassView(APIView):

    def get(self, request):
        if request.user.is_authenticated:
            return JsonResponse({'response': get_success_response(get_class_list())})
        else:
            return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})


from .handlers.new_student import get_class_section_list
@api_view(['GET'])
def get_class_section_list_view(request, session_id):
    if request.user.is_authenticated:
        data = {}
        data['sessionDbId'] = session_id
        return JsonResponse({'response': get_success_response(get_class_section_list(data))})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})


############## Section ##############
from .business.section import get_section_list


class SectionListView(APIView):

    @user_permission
    def get(request):
        return get_section_list()


############ ClassTeacherSignature ###########
from .business.class_teacher_signature import create_class_teacher_signature_object, partial_update_class_teacher_signature_object


class ClassTeacherSignatureView(CommonView, APIView):
    Model = ClassTeacherSignature

    @user_permission_new
    def post(self, request):
        return create_class_teacher_signature_object(request, self.Model, self.ModelSerializer)

    @user_permission_new
    def patch(self, request):
        return partial_update_class_teacher_signature_object(request, self.Model, self.ModelSerializer)


class ClassTeacherSignatureListView(CommonListView, APIView):
    Model = ClassTeacherSignature

