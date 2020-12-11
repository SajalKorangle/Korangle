
from rest_framework.views import APIView

from decorators import user_permission_3

import json

from rest_framework import serializers

from common.common_serializer_interface_3 import get_object, get_list, create_object, create_list, \
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

        def is_valid(self, raise_exception=False, *args, **kwargs):
            original_response = super().is_valid(raise_exception=raise_exception)
            return original_response and validator(self.validated_data, *args, **kwargs) 

        class Meta:
            model = Model
            fields = '__all__'

    return ModelSerializer


########### Common View ########

class CommonBaseView():

    Model = ''
    ModelSerializer = ''
    RelationsToSchool = []   # ex: parentStudent__parentSchool
    RelationsToStudent = []

    def __init__(self):
        self.ModelSerializer = get_model_serializer(self.Model, fields__korangle=None, validator=self.validator)

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
    
    def permittedQuerySet(self, activeSchoolID, activeStudentID):
        query_filters = {}
        if (activeStudentID): # for parent only
            for relation in self.RelationsToStudent:
                query_filters[relation] = activeStudentID
        for relation in self.RelationsToSchool:
            query_filters[relation] = activeSchoolID
        return self.Model.objects.filter(**query_filters)


class CommonView(CommonBaseView):
    
    @user_permission_3
    def get(self, request, activeSchoolID, activeStudentID):
        filtered_query_set = self.permittedQuerySet(activeSchoolID, activeStudentID)
        return get_object(request.GET, filtered_query_set, self.ModelSerializer)

    @user_permission_3
    def post(self, request, activeSchoolID, activeStudentID):
        return create_object(request.data, self.ModelSerializer, activeSchoolID, activeStudentID)

    @user_permission_3
    def put(self, request, activeSchoolID, activeStudentID):
        filtered_query_set = self.permittedQuerySet(activeSchoolID, activeStudentID)
        return update_object(request.data, self.Model, filtered_query_set, self.ModelSerializer, activeSchoolID, activeStudentID)

    @user_permission_3
    def patch(self, request, activeSchoolID, activeStudentID):
        filtered_query_set = self.permittedQuerySet(activeSchoolID, activeStudentID)
        return partial_update_object(request.data, filtered_query_set, self.ModelSerializer, activeSchoolID, activeStudentID)

    @user_permission_3
    def delete(self, request, activeSchoolID, activeStudentID):
        filtered_query_set = self.permittedQuerySet(activeSchoolID, activeStudentID)
        return delete_object(request.GET, query_set)


class CommonListView(CommonBaseView):

    @user_permission_3
    def get(self, request, activeSchoolID, activeStudentID):
        filtered_query_set = self.permittedQuerySet(activeSchoolID, activeStudentID)
        if 'fields__korangle' in request.GET:
            self.ModelSerializer = get_model_serializer(self.Model, fields__korangle=request.GET['fields__korangle'], validator=self.validator)
        return get_list(request.GET, filtered_query_set, self.ModelSerializer)

    @user_permission_3
    def post(self, request, activeSchoolID, activeStudentID):
        return create_list(request.data, self.ModelSerializer, activeSchoolID, activeStudentID)

    @user_permission_3
    def put(self, request, activeSchoolID, activeStudentID):
        filtered_query_set = self.permittedQuerySet(activeSchoolID, activeStudentID)
        return update_list(request.data, self.Model, self.ModelSerializer, request.GET)

    @user_permission_3
    def patch(self, request, activeSchoolID, activeStudentID):
        filtered_query_set = self.permittedQuerySet(activeSchoolID, activeStudentID)
        return partial_update_list(request.data, filtered_query_set, self.ModelSerializer, activeSchoolID, activeStudentID)

    @user_permission_3
    def delete(self, request, activeSchoolID, activeStudentID):
        filtered_query_set = self.permittedQuerySet(activeSchoolID, activeStudentID)
        return delete_list(request.GET, filtered_query_set, self.ModelSerializer)


