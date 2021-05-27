
from rest_framework.views import APIView

from decorators import user_permission_new, get_with_post

import json

from rest_framework import serializers

from common.common_serializer_interface_file import get_object, get_list, create_object, create_list, \
    update_object, update_list, partial_update_object, partial_update_list, delete_object, delete_list


def get_model_serializer(Model, fields__korangle):

    class ModelSerializer(serializers.ModelSerializer):

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)

            if fields__korangle is not None:
                fields = set(fields__korangle.split(','))
                all_fields = set(self.fields.keys())
                for not_requested in all_fields - set(fields):
                    self.fields.pop(not_requested)

        class Meta:
            model = Model
            fields = '__all__'

    return ModelSerializer


########### Common View ########


class CommonView():

    Model = ''
    ModelSerializer = ''

    def __init__(self):
        self.ModelSerializer = get_model_serializer(self.Model, fields__korangle=None)

    @user_permission_new
    def get(self, request):
        return get_object(request.GET, self.Model, self.ModelSerializer)

    @get_with_post
    @user_permission_new
    def post(self, request):
        return create_object(request.data, self.Model, self.ModelSerializer)

    @user_permission_new
    def put(self, request):
        return update_object(request.data, self.Model, self.ModelSerializer)

    @user_permission_new
    def patch(self, request):
        return partial_update_object(request.data, self.Model, self.ModelSerializer)

    @user_permission_new
    def delete(self, request):
        return delete_object(request.GET, self.Model, self.ModelSerializer)


class CommonListView():

    Model = ''
    ModelSerializer = ''

    def __init__(self):
        self.ModelSerializer = get_model_serializer(self.Model, fields__korangle=None)

    @user_permission_new
    def get(self, request):
        if 'fields__korangle' in request.GET:
            self.ModelSerializer = get_model_serializer(self.Model, fields__korangle=request.GET['fields__korangle'])
        return get_list(request.GET, self.Model, self.ModelSerializer)

    @get_with_post
    @user_permission_new
    def post(self, request):
        return create_list(request.data, self.Model, self.ModelSerializer)

    @user_permission_new
    def put(self, request):
        return update_list(request.data, self.Model, self.ModelSerializer)

    @user_permission_new
    def patch(self, request):
        return partial_update_list(request.data, self.Model, self.ModelSerializer)

    @user_permission_new
    def delete(self, request):
        return delete_list(request.GET, self.Model, self.ModelSerializer)
