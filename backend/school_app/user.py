from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework_jwt.views import JSONWebTokenAPIView
from rest_framework_jwt.serializers import JSONWebTokenSerializer

from django.conf import settings
User = settings.AUTH_USER_MODEL

from django.db.models import F
from django.db.models import Q

from datetime import date

from team_app.models import Module
from student_app.models import StudentSection
from employee_app.models import Employee, EmployeePermission


def get_data_from_school_list(schoolList, schoolDbId):

    for school_data in schoolList:
        if school_data['dbId'] == schoolDbId:
            return school_data

    return None


def get_student_data(student_object):

    student_data = dict()
    student_data['id'] = student_object.id
    student_data['name'] = student_object.name
    student_data['fathersName'] = student_object.fathersName
    if student_object.profileImage:
        student_data['profileImage'] = student_object.profileImage.url
    else:
        student_data['profileImage'] = None

    return student_data


def get_school_list(user):

    school_list = []

    # Mobile Number User
    # if user.username.isdigit():

    # Parent User
    for student_section_object in \
        StudentSection.objects.filter(Q(parentStudent__mobileNumber=user.username)
                                      | Q(parentStudent__secondMobileNumber=user.username),
                                      parentStudent__parentSchool__expired=False,
                                      parentSession=F('parentStudent__parentSchool__currentSession')) \
                .select_related('parentStudent__parentSchool'):

        school_data = get_data_from_school_list(school_list, student_section_object.parentStudent.parentSchool_id)

        if school_data is None:
            school_data = get_school_data_by_object(student_section_object.parentStudent.parentSchool)
            school_list.append(school_data)

        school_data['studentList'].append(get_student_data(student_section_object.parentStudent))
        school_data['role'] = 'Parent'

    # Employee User
    for employee_object in Employee.objects.filter(mobileNumber=user.username,
                                                   parentSchool__expired=False,
                                                   dateOfLeaving=None).select_related('parentSchool'):

        school_data = get_data_from_school_list(school_list, employee_object.parentSchool_id)

        if school_data is None:
            school_data = get_school_data_by_object(employee_object.parentSchool)
            school_list.append(school_data)

        school_data['role'] = 'Employee'
        school_data['employeeId'] = employee_object.id
        school_data['moduleList'] = get_employee_school_module_list(employee_object)

    return school_list


def get_employee_school_module_list(employee_object):

    moduleList = []

    school_object = employee_object.parentSchool

    '''for access_object in \
            Access.objects.filter(parentSchool=school_object)\
                    .order_by('parentModule__orderNumber')\
                    .select_related('parentModule'):'''
    for module_object in \
            Module.objects.filter(Q(parentBoard=None) | Q(parentBoard=school_object.parentBoard))\
                    .order_by('orderNumber'):
        tempModule = {}
        tempModule['dbId'] = module_object.id
        tempModule['path'] = module_object.path
        tempModule['title'] = module_object.title
        tempModule['icon'] = module_object.icon
        tempModule['taskList'] = []
        for permission_object in \
                EmployeePermission.objects.filter(parentEmployee=employee_object,
                                                  parentTask__parentModule=module_object)\
                    .order_by('parentTask__orderNumber') \
                    .select_related('parentTask'):
            tempTask = {}
            tempTask['dbId'] = permission_object.parentTask.id
            tempTask['path'] = permission_object.parentTask.path
            tempTask['title'] = permission_object.parentTask.title
            tempTask['videoUrl'] = permission_object.parentTask.videoUrl
            tempModule['taskList'].append(tempTask)
        if len(tempModule['taskList']) > 0:
            moduleList.append(tempModule)

    return moduleList


def get_school_data_by_object(school_object):
    school_data = {}
    school_data['name'] = school_object.name
    school_data['printName'] = school_object.printName
    if school_object.profileImage:
        school_data['profileImage'] = school_object.profileImage.url
    else:
        school_data['profileImage'] = "https://korangleplus.s3.amazonaws.com/schools/18/main.png"
    if school_object.principalSignatureImage:
        school_data['principalSignatureImage'] = school_object.principalSignatureImage.url
    else:
        school_data['principalSignatureImage'] = None
    school_data['mobileNumber'] = school_object.mobileNumber
    school_data['primaryThemeColor'] = school_object.primaryThemeColor
    school_data['secondaryThemeColor'] = school_object.secondaryThemeColor
    school_data['dbId'] = school_object.id
    school_data['schoolDiseCode'] = school_object.diseCode

    school_data['schoolAddress'] = school_object.address
    school_data['pincode'] = school_object.pincode
    school_data['villageCity'] = school_object.villageCity
    school_data['block'] = school_object.block
    school_data['district'] = school_object.district
    school_data['state'] = school_object.state

    school_data['currentSessionDbId'] = school_object.currentSession.id
    school_data['name'] = school_object.name
    school_data['registrationNumber'] = school_object.registrationNumber
    school_data['affiliationNumber'] = school_object.affiliationNumber
    school_data['headerSize'] = school_object.headerSize

    school_data['opacity'] = school_object.opacity

    school_data['parentBoard'] = school_object.parentBoard.id

    school_data['medium'] = school_object.medium

    school_data['employeeId'] = None

    school_data['expired'] = school_object.expired

    school_data['moduleList'] = []
    school_data['studentList'] = []

    return school_data


class AuthenticationHandler():
    def authenticate_and_login(username, response):
        if 'token' in response.data:
            user = User.objects.filter(username=username)
            response.data.update(get_user_details(user[0]))
        else:
            response.data['username'] = 'invalidUsername'
            response.data['email'] = 'invalidEmail'
        return response.data


class LoginUserView(JSONWebTokenAPIView):
    serializer_class = JSONWebTokenSerializer

    def post(self, request, *args, **kwargs):
        username = request.data['username']
        if username:
            username = str(username).lower()
            request.data['username'] = username
        response = super().post(request)

        print(response)

        response_data = AuthenticationHandler.authenticate_and_login(
                username=username,
                response=response
        )
        return Response({"data": response_data})


class UserDetailsView(APIView):
    def get(self, request):
        userDetails = {}
        print(request.user)
        if request.user.is_authenticated:
            userDetails = get_user_details(request.user)
        return Response({"data": userDetails})


def get_user_details(user_object):

    response = {
        'username': user_object.username,
        'first_name': user_object.first_name,
        'last_name': user_object.last_name,
        'email': user_object.email,
        'id': user_object.id,
        'schoolList': get_school_list(user_object),
    }

    return response
