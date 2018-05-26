from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework_jwt.views import JSONWebTokenAPIView
from rest_framework_jwt.serializers import JSONWebTokenSerializer

from django.contrib.auth.models import User

from school_app.model.models import School
from team_app.models import Member, Access, Module, Permission


def get_school_list(user):

    schoolList = []

    for member_object in Member.objects.filter(parentUser=user):

        schoolList.append(get_school_data_by_object(member_object.parentSchool, user))

    return schoolList


def get_school_data_by_object(school_object, user_object):
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
                                          parentTask__parentModule=access_object.parentModule) \
                .select_related('parentTask'):
            tempTask = {}
            tempTask['dbId'] = permission_object.parentTask.id
            tempTask['path'] = permission_object.parentTask.path
            tempTask['title'] = permission_object.parentTask.title
            tempModule['taskList'].append(tempTask)
        if len(tempModule['taskList']) > 0:
            school_data['moduleList'].append(tempModule)

    print(school_data['name'])
    return school_data


'''def get_school_data(user):
    school_data = {}
    school_objects = School.objects.filter(user=user)
    if len(school_objects) > 0:
        school_data['name'] = school_objects[0].name
        school_data['printName'] = school_objects[0].printName
        if school_objects[0].logo:
            school_data['logo'] = school_objects[0].logo.url
        else:
            school_data['logo'] = ''
        school_data['primaryThemeColor'] = school_objects[0].primaryThemeColor
        school_data['secondaryThemeColor'] = school_objects[0].secondaryThemeColor
        school_data['complexFeeStructure'] = school_objects[0].complexFeeStructure
        school_data['dbId'] = school_objects[0].id
        school_data['schoolDiseCode'] = school_objects[0].diseCode
        school_data['schoolAddress'] = school_objects[0].address
        school_data['currentSessionDbId'] = school_objects[0].currentSession.id
        school_data['name'] = school_objects[0].name
        school_data['registrationNumber'] = school_objects[0].registrationNumber
        print(school_data)
    return school_data'''


class AuthenticationHandler():
    def authenticate_and_login(username, response):
        if 'token' in response.data:
            user = User.objects.filter(username=username)
            response.data['username'] = user[0].username
            response.data['email'] = user[0].email
            # response.data['schoolData'] = get_school_data(user[0])
            response.data['schoolList'] = get_school_list(user[0])
        else:
            response.data['username'] = 'invalidUsername'
            response.data['email'] = 'invalidEmail'


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

        AuthenticationHandler.authenticate_and_login(
                username=username,
                response=response
        )
        return Response({"data": response.data})
        # return APIResponse(data=response.data, status=status.HTTP_200_OK)


class UserDetailsView(APIView):
    def get(self, request):
        userDetails = {}
        print(request.user)
        if request.user.is_authenticated:
            userDetails['username'] = request.user.username
            userDetails['email'] = request.user.email
            # userDetails['schoolData'] = get_school_data(request.user)
            userDetails['schoolList'] = get_school_list(request.user)
        return Response({"data": userDetails})

