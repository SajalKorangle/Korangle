
from rest_framework.views import APIView

from decorators import user_permission_new

import json

from rest_framework import serializers

from common.common_serializer_interface import get_object, get_list, create_object, create_list, \
    update_object, update_list, partial_update_object, partial_update_list, delete_object, delete_list


def get_model_serializer(Model):

    class ModelSerializer(serializers.ModelSerializer):
        class Meta:
            model = Model
            fields = '__all__'

    return ModelSerializer


########### Common View ########


class CommonView():

    Model = ''
    ModelSerializer = ''

    def __init__(self):
        self.ModelSerializer = get_model_serializer(self.Model)

    @user_permission_new
    def get(self, request):
        return get_object(request.GET, self.Model, self.ModelSerializer)

    @user_permission_new
    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        return create_object(data, self.Model, self.ModelSerializer)

    @user_permission_new
    def put(self, request):
        data = json.loads(request.body.decode('utf-8'))
        return update_object(data, self.Model, self.ModelSerializer)

    @user_permission_new
    def patch(self, request):
        data = json.loads(request.body.decode('utf-8'))
        return partial_update_object(data, self.Model, self.ModelSerializer)

    @user_permission_new
    def delete(self, request):
        return delete_object(request.GET, self.Model, self.ModelSerializer)


class CommonListView():

    Model = ''
    ModelSerializer = ''

    def __init__(self):
        self.ModelSerializer = get_model_serializer(self.Model)

    @user_permission_new
    def get(self, request):
        return get_list(request.GET, self.Model, self.ModelSerializer)

    @user_permission_new
    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        return create_list(data, self.Model, self.ModelSerializer)

    @user_permission_new
    def put(self, request):
        data = json.loads(request.body.decode('utf-8'))
        return update_list(data, self.Model, self.ModelSerializer)

    @user_permission_new
    def patch(self, request):
        data = json.loads(request.body.decode('utf-8'))
        return partial_update_list(data, self.Model, self.ModelSerializer)

    @user_permission_new
    def delete(self, request):
        return delete_list(request.GET, self.Model, self.ModelSerializer)


