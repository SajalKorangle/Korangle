# from rest_framework.decorators import api_view
# from helloworld_project.settings import PROJECT_ROOT
# from django.core.mail.message import EmailMessage
# from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
# import json
# import os

from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework_jwt.views import JSONWebTokenAPIView
from rest_framework_jwt.serializers import JSONWebTokenSerializer

from django.contrib.auth.models import User

class AuthenticationHandler():
	def authenticate_and_login(username, response):
		if 'token' in response.data:
			user = User.objects.filter(username=username)
			response.data['username'] = user[0].username
			response.data['email'] = user[0].email
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
		return Response({"data": userDetails})

