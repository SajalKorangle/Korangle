from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework_jwt.views import JSONWebTokenAPIView
from rest_framework_jwt.serializers import JSONWebTokenSerializer

from django.contrib.auth.models import User

from school_app.model.models import School
from team_app.models import Member, Access, Module, Permission
from student_app.models import Student, StudentSection

from student_app.business.student_mini_profile import get_student_mini_profile


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

    return student_data


def get_school_list(user):

    school_list = []

    # Parent User
    if user.username.isdigit():
        for student_object in Student.objects.filter(mobileNumber=user.username):

            school_data = get_data_from_school_list(school_list, student_object.parentSchool_id)

            if school_data is None:
                school_data = get_school_data_by_object(student_object.parentSchool)

                student_section_queryset = \
                    StudentSection.objects.filter(parentStudent_id=student_object.id,
                                                  parentSection__parentClassSession__parentSession_id=school_data[
                                                      'currentSessionDbId'])

                if student_section_queryset.count() == 0:
                    continue

                school_data['studentList'].append(get_student_data(student_object))
                school_data['role'] = 'Parent'
                school_list.append(school_data)
            else:

                student_section_queryset = \
                    StudentSection.objects.filter(parentStudent_id=student_object.id,
                                                  parentSection__parentClassSession__parentSession_id=school_data[
                                                      'currentSessionDbId'])

                if student_section_queryset.count() == 0:
                    continue

                school_data['role'] = 'Parent'
                school_data['studentList'].append(get_student_data(student_object))

    # Team Member
    for member_object in Member.objects.filter(parentUser=user):

        school_data = get_data_from_school_list(school_list, member_object.parentSchool_id)

        if school_data is None:
            school_data = get_school_data_by_object(member_object.parentSchool)
            school_data['moduleList'] = get_user_module_list(member_object.parentSchool, user)
            school_data['role'] = 'Employee'
            school_list.append(school_data)
        else:
            school_data['role'] = 'Employee'
            school_data['moduleList'] = get_user_module_list(member_object.parentSchool, user)

    return school_list


def get_user_module_list(school_object, user_object):

    moduleList = []

    for access_object in \
            Access.objects.filter(parentSchool=school_object)\
                    .order_by('parentModule__orderNumber')\
                    .select_related('parentModule'):
        tempModule = {}
        tempModule['dbId'] = access_object.parentModule.id
        tempModule['path'] = access_object.parentModule.path
        tempModule['title'] = access_object.parentModule.title
        tempModule['icon'] = access_object.parentModule.icon
        tempModule['taskList'] = []
        for permission_object in \
                Permission.objects.filter(parentUser=user_object,
                                          parentSchool=school_object,
                                          parentTask__parentModule=access_object.parentModule)\
                    .order_by('parentTask__orderNumber') \
                    .select_related('parentTask'):
            tempTask = {}
            tempTask['dbId'] = permission_object.parentTask.id
            tempTask['path'] = permission_object.parentTask.path
            tempTask['title'] = permission_object.parentTask.title
            tempModule['taskList'].append(tempTask)
        if len(tempModule['taskList']) > 0:
            moduleList.append(tempModule)

    return moduleList


def get_school_data_by_object(school_object):
    school_data = {}
    school_data['name'] = school_object.name
    school_data['printName'] = school_object.printName
    if school_object.logo:
        school_data['logo'] = school_object.logo.url
    else:
        school_data['logo'] = ''
    school_data['primaryThemeColor'] = school_object.primaryThemeColor
    school_data['secondaryThemeColor'] = school_object.secondaryThemeColor
    school_data['complexFeeStructure'] = school_object.complexFeeStructure
    school_data['dbId'] = school_object.id
    school_data['schoolDiseCode'] = school_object.diseCode
    school_data['schoolAddress'] = school_object.address
    school_data['currentSessionDbId'] = school_object.currentSession.id
    school_data['name'] = school_object.name
    school_data['registrationNumber'] = school_object.registrationNumber

    school_data['moduleList'] = []
    school_data['studentList'] = []

    return school_data


class AuthenticationHandler():
    def authenticate_and_login(username, response):
        if 'token' in response.data:
            user = User.objects.filter(username=username)
            response.data.update(get_user_details(user[0]))
            '''response.data['username'] = user[0].username
            response.data['firstName'] = user[0].first_name
            response.data['id'] = user[0].id
            response.data['email'] = user[0].email
            response.data['schoolList'] = get_school_list(user[0])'''
        else:
            response.data['username'] = 'invalidUsername'
            response.data['email'] = 'invalidEmail'
        return response.data


class LoginUserView(JSONWebTokenAPIView):
    serializer_class = JSONWebTokenSerializer

    # @request_processor(fields=['username'])
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
        # return APIResponse(data=response.data, status=status.HTTP_200_OK)


class UserDetailsView(APIView):
    def get(self, request):
        userDetails = {}
        print(request.user)
        if request.user.is_authenticated:
            userDetails = get_user_details(request.user)
            '''userDetails['username'] = request.user.username
            userDetails['firstName'] = request.user.first_name
            userDetails['email'] = request.user.email
            userDetails['id'] = request.user.id
            userDetails['schoolList'] = get_school_list(request.user)'''
        return Response({"data": userDetails})


def get_user_details(user_object):

    response = {
        'username': user_object.username,
        'displayName': user_object.first_name,
        'email': user_object.email,
        'id': user_object.id,
        'schoolList': get_school_list(user_object),
    }

    return response