from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework_jwt.views import JSONWebTokenAPIView
from rest_framework_jwt.serializers import JSONWebTokenSerializer

from django.contrib.auth.models import User

from .models import School

class AuthenticationHandler():
	def authenticate_and_login(username, response):
		if 'token' in response.data:
			user = User.objects.filter(username=username)
			response.data['username'] = user[0].username
			response.data['email'] = user[0].email
			school_data = {}
			school_objects = School.objects.filter(user=user[0])
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
				response.data['schoolData'] = school_data;
			else:
				response.data['username'] = 'invalidUsername'
				response.data['email'] = 'invalidEmail'
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
			school_data = {}
			school_objects = School.objects.filter(user=request.user)
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
				userDetails['schoolData'] = school_data;
		return Response({"data": userDetails})

