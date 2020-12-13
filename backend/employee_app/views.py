from common.common_views_3 import CommonView, CommonListView
from decorators import user_permission

from rest_framework.views import APIView

import json


############## Employee Profile ##############
from employee_app.models import Employee
from .business.employee_profile \
    import get_employee_profile, create_employee_profile, delete_employee_profile, \
    update_employee_profile, get_employee_profile_list


class EmployeeProfileView(APIView):

    @user_permission
    def get(request, employee_id):
        data = {
            'id': employee_id,
        }
        return get_employee_profile(data)

    @user_permission
    def post(request):
        data = json.loads(request.body.decode('utf-8'))
        return create_employee_profile(data)

    @user_permission
    def put(request, employee_id):
        data = json.loads(request.body.decode('utf-8'))
        return update_employee_profile(data)

    @user_permission
    def delete(request, employee_id):
        data = {
            'id': employee_id,
        }
        return delete_employee_profile(data)


class EmployeeProfileListView(APIView):

    @user_permission
    def get(request, school_id):
        data = {
            'parentSchool': school_id,
        }
        return get_employee_profile_list(data)


############## Employee Mini Profile ##############
from .business.employee_mini_profile import get_employee_mini_profile_list


class EmployeeMiniProfileView(APIView):

    @user_permission
    def get(request, school_id):
        data = {
            'parentSchool': school_id,
        }
        return get_employee_mini_profile_list(data)


############## Employee Session Details ##############
from .business.employee_session_detail import get_employee_session_detail_list, get_employee_session_detail, \
    create_employee_session_detail, update_employee_session_detail


class EmployeeSessionDetailView(APIView):

    @user_permission
    def get(request, employee_id):
        data = {
            'parentEmployee': employee_id,
            'sessionId': request.GET['sessionId'],
        }
        return get_employee_session_detail(data)

    @user_permission
    def post(request):
        data = json.loads(request.body.decode('utf-8'))
        return create_employee_session_detail(data)

    @user_permission
    def put(request, employee_id):
        data = json.loads(request.body.decode('utf-8'))
        return update_employee_session_detail(data)


class EmployeeSessionDetailListView(APIView):

    @user_permission
    def get(request, school_id):
        data = {
            'parentSchool': school_id,
            'sessionId': request.GET['sessionId'],
        }
        return get_employee_session_detail_list(data)


############## Employee Permission ##############
from .business.employee_permission import get_employee_permission_list, \
    create_employee_permission, delete_employee_permission, create_employee_permission_list


class EmployeePermissionOldView(APIView):

    @user_permission
    def post(request):
        data = json.loads(request.body.decode('utf-8'))
        return create_employee_permission(data)

    @user_permission
    def delete(request, employee_permission_id):
        data = {
            'id': employee_permission_id
        }
        return delete_employee_permission(data)


class EmployeePermissionOldListView(APIView):

    @user_permission
    def get(request, employee_id):
        data = {
            'parentEmployee': employee_id,
        }
        return get_employee_permission_list(data)

    @user_permission
    def post(request):
        data = json.loads(request.body.decode('utf-8'))
        print("okay one")
        return create_employee_permission_list(data)

############ Profile Image ########################
from .business.profile_image import update_profile_image

class ProfileImageView(APIView):

    @user_permission
    def post(request, employee_id):
        return update_profile_image(request.FILES['myFile'], employee_id)


########### Employee ############


class EmployeeView(CommonView, APIView):
    Model = Employee
    RelationsToSchool = ['parentSchool']


class EmployeeListView(CommonListView, APIView):
    Model = Employee
    RelationsToSchool = ['parentSchool']

########### EmployeePermission ############
from .models import EmployeePermission


class EmployeePermissionView(CommonView, APIView):
    Model = EmployeePermission
    RelationsToSchool = ['parentEmployee__parentSchool']


class EmployeePermissionListView(CommonListView, APIView):
    Model = EmployeePermission
    RelationsToSchool = ['parentEmployee__parentSchool']

from .models import EmployeeSessionDetail

class EmployeeeSessionDetailView(CommonView,APIView):
    Model = EmployeeSessionDetail
    RelationsToSchool = ['parentEmployee__parentSchool']

class EmployeeeSessionDetailListView(CommonListView,APIView):
    Model = EmployeeSessionDetail
    RelationsToSchool = ['parentEmployee__parentSchool']