from django.apps import apps
from rest_framework.views import APIView

from decorators import user_permission_3

import json

from rest_framework import serializers

from common.common_serializer_interface_3 import get_object, get_list, create_object, create_list, \
    update_object, update_list, partial_update_object, partial_update_list, delete_object, delete_list

from functools import reduce
from django.http import HttpResponseForbidden



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

class CommonBaseView(APIView):

    Model = ''
    ModelSerializer = ''
    RelationsToSchool = []   # ex: parentStudent__parentSchool__id
    RelationsToStudent = []
    permittedMethods = ['get', 'post', 'put', 'patch', 'delete']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.ModelSerializer = get_model_serializer(self.Model, fields__korangle=None, validator=self.validator)
        for method in list(set(['get', 'post', 'put', 'patch', 'delete']) - set(self.permittedMethods)):
            setattr(self, method, self.notPermittedFunction)

    @user_permission_3
    def notPermittedFunction(*args, **kwargs):
        return HttpResponseForbidden()

    def validator(self, validated_data, activeSchoolID, activeStudentID):

        # Checking for Parent
        if(activeStudentID):  # activeStudentID can be a list of studentId's
            for relation in self.RelationsToStudent:
                splitted_relation = relation.split('__')
                related_object = validated_data.get(splitted_relation[0], None)
                if related_object is not None:
                    if not (reduce(lambda a, b: getattr(a, b), splitted_relation[1:], related_object) in activeStudentID):
                        return False

        # Checking for Parent & Employee Both
        for relation in self.RelationsToSchool:
            splitted_relation = relation.split('__')
            related_object = validated_data.get(splitted_relation[0], None)
            if related_object is not None:
                if (reduce(lambda a, b: getattr(a, b), splitted_relation[1:], related_object) != activeSchoolID):
                    return False

        return True

    def permittedQuerySet(self, activeSchoolID, activeStudentID):
        query_filters = {}

        # Here we are banking on the fact that
        # 1. if RelationsToStudent exist then RelationsToSchool always exist,
        # 2. activeStudentId represents parent, non existance of activeStudentId & existence of activeSchoolId represents employee, nothing represent simple user.

        if (activeStudentID and len(self.RelationsToStudent) > 0):  # for parent only, activeStudentID can be a list of studentId's
            query_filters[self.RelationsToStudent[0]+'__in'] = activeStudentID     # takes the first relation to student only(should be the closest)
        elif (len(self.RelationsToSchool) > 0):
            query_filters[self.RelationsToSchool[0]] = activeSchoolID    # takes the first relation to school only(should be the the closest)
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
        return update_object(request.data, filtered_query_set, self.ModelSerializer, activeSchoolID, activeStudentID)

    @user_permission_3
    def patch(self, request, activeSchoolID, activeStudentID):
        filtered_query_set = self.permittedQuerySet(activeSchoolID, activeStudentID)
        return partial_update_object(request.data, filtered_query_set, self.ModelSerializer, activeSchoolID, activeStudentID)

    @user_permission_3
    def delete(self, request, activeSchoolID, activeStudentID):
        filtered_query_set = self.permittedQuerySet(activeSchoolID, activeStudentID)
        return delete_object(request.GET, filtered_query_set)


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
        return update_list(request.data, filtered_query_set, self.ModelSerializer, activeSchoolID, activeStudentID)

    @user_permission_3
    def patch(self, request, activeSchoolID, activeStudentID):
        filtered_query_set = self.permittedQuerySet(activeSchoolID, activeStudentID)
        return partial_update_list(request.data, filtered_query_set, self.ModelSerializer, activeSchoolID, activeStudentID)

    @user_permission_3
    def delete(self, request, activeSchoolID, activeStudentID):
        filtered_query_set = self.permittedQuerySet(activeSchoolID, activeStudentID)
        return delete_list(request.GET, filtered_query_set)


def common_json_view_function(request_json, app_name, file_name):
    json_data = open(apps.get_app_config(app_name).path + '/constant_database/' + file_name)
    content = json.load(json_data)
    result = [x for x in content if filter_json_func(x, request_json)]
    return result


def filter_json_func(db_content, request_json):
    for key in request_json:
        try:
            if key == 'e' or key == 'activeSchoolID':
                continue
            if key.endswith('__in'):
                array = request_json[key].split(",")
                if str(db_content[key[:-4]]) not in array:
                    return False
            elif str(db_content[key]) != request_json[key]:
                return False
        except KeyError:
            return False
    return True
