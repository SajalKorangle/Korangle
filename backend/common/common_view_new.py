
from rest_framework.views import APIView

from decorators import user_permission_3

import json

from rest_framework import serializers

from common.common_serializer_interface_new import get_object, get_list, create_object, create_list, \
    update_object, update_list, partial_update_object, partial_update_list, delete_object, delete_list

from functools import reduce

def get_model_serializer(Model, fields__korangle, validator):

    class ModelSerializer(serializers.ModelSerializer):

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)

            if fields__korangle is not None:
                fields = set(fields__korangle.split(','))
                all_fields = set(self.fields.keys())
                for not_requested in all_fields - set(fields):
                    self.fields.pop(not_requested)

        def is_valid(self, *args, **kwargs):
            original_response = super().is_valid()
            return original_response and validator(self.validated_data, *args, **kwargs) 

        class Meta:
            model = Model
            fields = '__all__'

    return ModelSerializer


########### Common View ########

class CommonSecurity():
    RelationsToSchool = []   # ex: parentStudent__parentSchool
    RelationsToStudent = []

    def validator(self, valideted_data, activeSchoolID, activeStudentID):
        if(activeStudentID):
            for relation in self.RelationsToStudent:
                splitted_relation = relation.split('__') + ['id']
                splitted_relation[0] = valideted_data[splitted_relation[0]]
                if (reduce(lambda a, b: getattr(a, b), splitted_relation) != activeStudentID):
                    return False
            for relation in self.RelationsToSchool:
            splitted_relation = relation.split('__') + ['id']
            splitted_relation[0] = valideted_data[splitted_relation[0]]
            if (reduce(lambda a, b: getattr(a, b), splitted_relation) != activeSchoolID):
                return False
        return True
    
    def requestPreProcessing(self, request):
        request.GET._mutable = True
        if (request.GET['activeStudentID']): # parent 
            activeStudentID = request.GET['activeStudentID']
            del request.GET['activeStudentID']
            for relation in self.RelationsToStudent:
                request.GET[relation] = activeStudentID
        activeSchoolID = request.GET['activeSchoolID']
        del request.GET['activeSchoolID']
        for relation in self.RelationsToSchool:
            request.GET[relation] = activeSchoolID
        request.GET._mutable = False
        return request


class CommonView(CommonSecurity):

    Model = ''
    ModelSerializer = ''

    def __init__(self):
        self.ModelSerializer = get_model_serializer(self.Model, fields__korangle=None, validator=self.validator)
    
    @user_permission_3
    def get(self, request):
        request = self.requestPreProcessing(request)
        return get_object(request.GET, self.Model, self.ModelSerializer)

    @user_permission_3
    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        return create_object(data, self.Model, self.ModelSerializer, request.GET)

    @user_permission_3
    def put(self, request):
        data = json.loads(request.body.decode('utf-8'))
        return update_object(data, self.Model, self.ModelSerializer, request.GET)

    @user_permission_3
    def patch(self, request):
        data = json.loads(request.body.decode('utf-8'))
        return partial_update_object(data, self.Model, self.ModelSerializer, request.GET)

    @user_permission_3
    def delete(self, request):
        request = self.requestPreProcessing(request)
        return delete_object(request.GET, self.Model, self.ModelSerializer)


class CommonListView(CommonSecurity):

    Model = ''
    ModelSerializer = ''


    def __init__(self, validator):
        self.ModelSerializer = get_model_serializer(self.Model, fields__korangle=None, validator=self.validator)

    @user_permission_3
    def get(self, request):
        request = self.requestPreProcessing(request)
        if 'fields__korangle' in request.GET:
            self.ModelSerializer = get_model_serializer(self.Model, fields__korangle=request.GET['fields__korangle'], validator=self.validator)
        return get_list(request.GET, self.Model, self.ModelSerializer)

    @user_permission_3
    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        return create_list(data, self.Model, self.ModelSerializer, request.GET)

    @user_permission_3
    def put(self, request):
        data = json.loads(request.body.decode('utf-8'))
        return update_list(data, self.Model, self.ModelSerializer, request.GET)

    @user_permission_3
    def patch(self, request):
        data = json.loads(request.body.decode('utf-8'))
        return partial_update_list(data, self.Model, self.ModelSerializer. request.GET)

    @user_permission_3
    def delete(self, request):
        request = self.requestPreProcessing(request)
        return delete_list(request.GET, self.Model, self.ModelSerializer)


