
from typing import Type
from django.http.request import QueryDict
from rest_framework.views import APIView

from decorators import user_permission_3

from rest_framework import serializers

from common.common_serializer_interface_3 import get_object, get_list, create_object, create_list, \
    update_object, update_list, partial_update_object, partial_update_list, delete_object, delete_list

from functools import reduce
from django.http import HttpResponseForbidden
from django.db import transaction as db_transaction
from django.http import HttpRequest
from rest_framework.request import Request

COMMON_VIEW_MAPPED_BY_MODEL_NAME = {}
COMMON_LIST_VIEW_MAPPED_BY_MODEL_NAME = {}


def get_populated_query_dict(activeSchoolId, activeStudentId):
    query_dict = QueryDict(mutable=True)
    query_dict.update({'activeSchoolID': activeSchoolId, 'activeStudentID': activeStudentId})
    query_dict._mutable = False
    return query_dict


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
        # 2. activeStudentId represents parent, non existence of activeStudentId & existence of activeSchoolId represents employee, nothing represent simple user.

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
        data = request.data

        received_fields = set(data.keys())
        data_mapped_by_related_field_name = {}

        for field_name in [related_field for related_field in received_fields if related_field.endswith('List')]:
            data_mapped_by_related_field_name[field_name] = data[field_name]
            del data[field_name]

        with db_transaction.atomic():
            response = create_object(data, self.ModelSerializer, activeSchoolID, activeStudentID)

            for field_name, related_data_list in data_mapped_by_related_field_name.items():
                # removing list from end and finding the related model field
                related_model_field = self.Model._meta.fields_map.get(field_name[:-4].lower(), None)
                if not related_model_field:
                    raise Exception('Invalid Field Name for Related Fields: {0} -> {1}'.format(field_name,
                                    field_name[:-4].lower()))  # verbose message for debugging

                related_model = related_model_field.related_model

                primary_key_value = response[self.Model._meta.pk.name]
                for related_data in related_data_list:
                    related_data.update({related_model_field.remote_field.name: primary_key_value})

                mock_request = HttpRequest()
                mock_request.GET = get_populated_query_dict(activeSchoolID, activeStudentID)
                mock_restframework_request = Request(mock_request)
                mock_restframework_request._full_data = related_data_list
                mock_restframework_request.user = request.user

                relatedCommonView = getCommonListViewForModel(related_model)()
                related_response = relatedCommonView.post(mock_restframework_request)
                response.update({field_name: related_response.data['response']['data']})

        return response

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
        dataList = request.data
        if len(dataList) == 0:
            return []

        return_data = []
        corresponding_common_view = getCommonViewForModel(self.Model)()
        with db_transaction.atomic():
            for data in dataList:
                mock_request = HttpRequest()
                mock_request.GET = get_populated_query_dict(activeSchoolID, activeStudentID)
                mock_restframework_request = Request(mock_request)
                mock_restframework_request._full_data = data
                mock_restframework_request.user = request.user
                return_data.append(corresponding_common_view.post(mock_restframework_request).data['response']['data'])

        return return_data

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


##  CommonView Model name mapping starts ##

def getCommonViewForModel(model) -> Type[CommonView]:
    global COMMON_VIEW_MAPPED_BY_MODEL_NAME

    if COMMON_VIEW_MAPPED_BY_MODEL_NAME.get(model.__name__, None) is not None:
        return COMMON_VIEW_MAPPED_BY_MODEL_NAME[model.__name__]

    for commonView in CommonView.__subclasses__():
        if commonView.Model.__name__ == model.__name__:
            COMMON_VIEW_MAPPED_BY_MODEL_NAME[model.__name__] = commonView
            return commonView


def getCommonListViewForModel(model) -> Type[CommonListView]:
    global COMMON_LIST_VIEW_MAPPED_BY_MODEL_NAME

    if COMMON_LIST_VIEW_MAPPED_BY_MODEL_NAME.get(model.__name__, None) is not None:
        return COMMON_LIST_VIEW_MAPPED_BY_MODEL_NAME[model.__name__]

    for commonListView in CommonListView.__subclasses__():
        if commonListView.Model.__name__ == model.__name__:
            COMMON_LIST_VIEW_MAPPED_BY_MODEL_NAME[model.__name__] = commonListView
            return commonListView

##  CommonView Model name mapping ends ##
