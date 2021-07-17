from django.shortcuts import render

from rest_framework.views import APIView

import json

from common.common_views_3 import CommonView, CommonListView
from decorators import user_permission

from django.conf import settings
User = settings.AUTH_USER_MODEL

# Create your views here.

from .business.profile import change_password, update_profile


class ProfileView(APIView):

    @user_permission
    def post(request):

        data = json.loads(request.body.decode('utf-8'))
        data['id'] = request.user.id
        return update_profile(data)


class ChangePasswordView(APIView):

    @user_permission
    def post(request):

        data = json.loads(request.body.decode('utf-8'))
        data['id'] = request.user.id
        return change_password(data)


########### Sub Fee Receipt #############


class UserView(CommonView, APIView):
    Model = User


class UserListView(CommonListView, APIView):
    Model = User


class NewPasswordView(APIView):

    @user_permission
    def post(request):

        data = json.loads(request.body.decode('utf-8'))
        data['id'] = request.user.id

        user = User.objects.get(id=data['id'])
        if not user.check_password(data['oldPassword']):
            return 'Old password incorrect'

        user.set_password(data['newPassword'])
        user.save()

        return 'Password updated successfully'



