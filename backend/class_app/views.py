from django.http import JsonResponse
from rest_framework.decorators import api_view

from decorators import user_permission

from common.common_views_3 import CommonView, CommonListView, APIView
from decorators import user_permission_new
from class_app.models import ClassTeacherSignature

# Why we needed it here
# def get_error_response(message):
#     error_response = {}
#     error_response['status'] = 'fail'
#     error_response['message'] = message
#     return error_response

# def get_success_response(data):
#     message_response = {}
#     message_response['status'] = 'success'
#     message_response['data'] = data
#     return message_response



# Not needed any more
############ ClassTeacherSignature ###########
# from .business.class_teacher_signature import create_class_teacher_signature_object, partial_update_class_teacher_signature_object


class ClassTeacherSignatureView(CommonView, APIView):
    Model = ClassTeacherSignature
    RelationsToSchool = ['parentSchool']

    # not needed any more
    # @user_permission_new
    # def post(self, request):
    #     return create_class_teacher_signature_object(request, self.Model, self.ModelSerializer)

    # @user_permission_new
    # def patch(self, request):
    #     return partial_update_class_teacher_signature_object(request, self.Model, self.ModelSerializer)


class ClassTeacherSignatureListView(CommonListView, APIView):
    Model = ClassTeacherSignature
    RelationsToSchool = ['parentSchool']
