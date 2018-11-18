from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework_jwt.views import JSONWebTokenAPIView
from rest_framework_jwt.serializers import JSONWebTokenSerializer

from django.contrib.auth.models import User

from django.db.models import F

from team_app.models import Access
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
        StudentSection.objects.filter(parentStudent__mobileNumber=user.username,
            parentSection__parentClassSession__parentSession=F('parentStudent__parentSchool__currentSession')) \
            .select_related('parentStudent__parentSchool'):

        school_data = get_data_from_school_list(school_list, student_section_object.parentStudent.parentSchool_id)

        if school_data is None:
            school_data = get_school_data_by_object(student_section_object.parentStudent.parentSchool)
            school_list.append(school_data)

        school_data['studentList'].append(get_student_data(student_section_object.parentStudent))
        school_data['role'] = 'Parent'

        '''for student_object in Student.objects.filter(mobileNumber=user.username).select_related('parentSchool'):

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
                school_data['studentList'].append(get_student_data(student_object))'''

    # Employee User
    for employee_object in Employee.objects.filter(mobileNumber=user.username,dateOfLeaving=None).select_related('parentSchool'):

        school_data = get_data_from_school_list(school_list, employee_object.parentSchool_id)

        if school_data is None:
            school_data = get_school_data_by_object(employee_object.parentSchool)
            school_list.append(school_data)

        school_data['role'] = 'Employee'
        school_data['employeeId'] = employee_object.id
        school_data['moduleList'] = get_employee_school_module_list(employee_object)

    # Team Member
    '''for member_object in Member.objects.filter(parentUser=user):

        school_data = get_data_from_school_list(school_list, member_object.parentSchool_id)

        if school_data is None:
            school_data = get_school_data_by_object(member_object.parentSchool)
            school_list.append(school_data)

        school_data['role'] = 'Employee'
        school_data['moduleList'] = get_user_module_list(member_object.parentSchool, user)'''

    return school_list


def get_employee_school_module_list(employee_object):

    moduleList = []

    school_object = employee_object.parentSchool

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
                EmployeePermission.objects.filter(parentEmployee=employee_object,
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

    '''jobModule = {
        'dbId': None,
        'path': 'job',
        'title': 'Job Details',
        'icon': None,
        'taskList': [
            {
                'dbId': None,
                'path': 'view_profile',
                'title': 'View Profile',
            },
            {
                'dbId': None,
                'path': 'view_attendance',
                'title': 'View Attendance',
            },
            {
                'dbId': None,
                'path': 'apply_leave',
                'title': 'Apply Leave',
            }
        ]
    }
    
    moduleList.append(jobModule)'''

    return moduleList


'''def get_user_module_list(school_object, user_object):

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

    return moduleList'''


def get_school_data_by_object(school_object):
    school_data = {}
    school_data['name'] = school_object.name
    school_data['printName'] = school_object.printName
    """
    if school_object.logo:
        school_data['logo'] = school_object.logo.url
    else:
        school_data['logo'] = ''
    """
    # school_data['profileImage'] = school_object.profileImage.url
    if school_object.profileImage:
        school_data['profileImage'] = school_object.profileImage.url
    else:
        school_data['profileImage'] = "https://korangleplus.s3.amazonaws.com/schools/18/main.png"
    school_data['mobileNumber'] = school_object.mobileNumber
    school_data['primaryThemeColor'] = school_object.primaryThemeColor
    school_data['secondaryThemeColor'] = school_object.secondaryThemeColor
    school_data['complexFeeStructure'] = school_object.complexFeeStructure
    school_data['dbId'] = school_object.id
    school_data['schoolDiseCode'] = school_object.diseCode
    school_data['schoolAddress'] = school_object.address
    school_data['currentSessionDbId'] = school_object.currentSession.id
    school_data['name'] = school_object.name
    school_data['registrationNumber'] = school_object.registrationNumber
    school_data['headerSize'] = school_object.headerSize

    school_data['medium'] = school_object.medium

    school_data['employeeId'] = None

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
        return Response({"data": userDetails})


def get_user_details(user_object):

    response = {
        'username': user_object.username,
        # 'displayName': user_object.first_name,
        'first_name': user_object.first_name,
        'last_name': user_object.last_name,
        'email': user_object.email,
        'id': user_object.id,
        'schoolList': get_school_list(user_object),
    }

    return response