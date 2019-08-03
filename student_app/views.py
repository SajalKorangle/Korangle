from django.http import JsonResponse
from rest_framework.decorators import api_view

from rest_framework.views import APIView

import json

from common.common_views import CommonView, CommonListView
from decorators import user_permission
from student_app.models import Student, StudentSection


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
def get_class_section_student_list_view(request, school_id, session_id):
    if request.user.is_authenticated:
        data = {}
        data['schoolDbId'] = school_id
        data['sessionDbId'] = session_id
        return JsonResponse({'response': get_success_response(get_class_section_student_list(data))})
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


############### New Student ######################
from .handlers.new_student import create_new_student
@api_view(['POST'])
def create_new_student_view(request):
    if request.user.is_authenticated:
        data = json.loads(request.body.decode('utf-8'))
        return JsonResponse({'response': get_success_response(create_new_student(data))})
    else:
        return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})


############## Student Full Profile ##############
from .business.student_full_profile import get_student_full_profile_by_school_and_session_id, \
    create_student_full_profile_list, get_student_full_profile_by_session_id, \
    partially_update_student_full_profile


class StudentFullProfileView(APIView):

    @user_permission
    def get(request, student_id):
        data = {}
        data['studentDbId'] = student_id
        data['sessionDbId'] = request.GET['session_id']
        return get_student_full_profile_by_session_id(data)

    @user_permission
    def patch(request, student_id):
        data = json.loads(request.body.decode('utf-8'))
        return partially_update_student_full_profile(data)


class StudentFullProfileListView(APIView):

    @user_permission
    def post(request):
        data = json.loads(request.body.decode('utf-8'))
        return create_student_full_profile_list(data)

    def get(self, request, school_id):
        if request.user.is_authenticated:
            data = {}
            data['schoolDbId'] = school_id
            data['sessionDbId'] = request.GET['session_id']
            return JsonResponse({'response': get_success_response(get_student_full_profile_by_school_and_session_id(data))})
        else:
            return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})


############## Student Mini Profile ##############
from .business.student_mini_profile import get_student_mini_profile_by_school_and_session_id


class StudentMiniProfileView(APIView):

    def get(self, request, school_id):
        if request.user.is_authenticated:
            data = {}
            data['schoolDbId'] = school_id
            if 'session_id' in request.GET:
                data['sessionDbId'] = request.GET['session_id']
            return JsonResponse({'response': get_success_response(get_student_mini_profile_by_school_and_session_id(data))})
        else:
            return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})


############# Student Section #####################
from .business.student_section import create_student_section_list, update_student_section, get_student_section_list


class StudentSectionOldView(APIView):

    @user_permission
    def put(request, student_section_id):
        data = json.loads(request.body.decode('utf-8'))
        return update_student_section(data)


class StudentSectionListOldView(APIView):

    @user_permission
    def get(request):
        return get_student_section_list(request.GET)

    def post(self, request):
        if request.user.is_authenticated:
            data = json.loads(request.body.decode('utf-8'))
            return JsonResponse({'response': get_success_response(create_student_section_list(data))})
        else:
            return JsonResponse({'response': get_error_response('User is not authenticated, logout and login again.')})


############ Delete Student #################
from student_app.models import StudentSection

# def get(request):
#     data = request.get.GET('q')

############ Profile Image ########################
from .business.profile_image import update_profile_image


class ProfileImageView(APIView):

    @user_permission
    def post(request, student_id):
        return update_profile_image(request.FILES['myFile'], student_id)



############ Transfer Certificate #################
from .business.transfer_certificate import create_transfer_certificate, \
    get_transfer_certificate, update_transfer_certificate, delete_transfer_certificate


class TransferCertificateView(APIView):

    @user_permission
    def get(request, transfer_certificate_id):
        data = {}
        data['id'] = transfer_certificate_id
        return get_transfer_certificate(data)

    @user_permission
    def post(request):
        data = json.loads(request.body.decode('utf-8'))
        return create_transfer_certificate(data)

    @user_permission
    def put(request, transfer_certificate_id):
        data = json.loads(request.body.decode('utf-8'))
        return update_transfer_certificate(data)

    @user_permission
    def delete(request, transfer_certificate_id):
        return delete_transfer_certificate(transfer_certificate_id)

#### check student session count ###
def check_student_sessions_count(data):
    qs1 = data['id']
    qs = {}
    qs['session_count'] = StudentSection.objects.filter(parentStudent=qs1).count()
    return qs


from student_app.models import StudentSection
@api_view(['GET'])
def get_student_sessions_count(request, *args, **kwargs):
    data = {}
    data['id'] = request.GET.get('id')
    return JsonResponse({'response': get_success_response(check_student_sessions_count(data))})


########### Student #############


class StudentView(CommonView, APIView):
    Model = Student


class StudentListView(CommonListView, APIView):
    Model = Student


########### Student Section #############


class StudentSectionView(CommonView, APIView):
    Model = StudentSection


class StudentSectionListView(CommonListView, APIView):
    Model = StudentSection


