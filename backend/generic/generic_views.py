
from django.db.models.signals import pre_init
from rest_framework.views import APIView

from decorators import user_permission_4


from .generic_serializer_interface import create_object, create_object_list


########### Common View ########

class GenericBaseView(APIView):

    Model = None

    def initial(self, request, *args, **kwargs):
        request.GET._mutable = True
        from django.apps import apps
        model = apps.get_model(request.GET['app_name'], request.GET['model_name'])
        del request.GET['app_name']
        del request.GET['model_name']
        request.GET._mutable = False
        self.Model = model
        super().initial(request, *args, **kwargs)


class GenericView(GenericBaseView):

    # @user_permission_3
    # def get(self, request, activeSchoolID, activeStudentID):
    #     self.initializeModel(request.GET)
    #     return get_object(request.GET, self.Model, activeSchoolID, activeStudentID)

    @user_permission_4
    def post(self, request, activeSchoolId, activeStudentIdList):
        data = request.data
        return create_object(data, self.Model, activeSchoolId, activeStudentIdList)

    # @user_permission_3
    # def put(self, request, activeSchoolID, activeStudentID):
    #     filtered_query_set = self.permittedQuerySet(activeSchoolID, activeStudentID)
    #     return update_object(request.data, filtered_query_set, self.ModelSerializer, activeSchoolID, activeStudentID)

    # @user_permission_3
    # def patch(self, request, activeSchoolID, activeStudentID):
    #     filtered_query_set = self.permittedQuerySet(activeSchoolID, activeStudentID)
    #     return partial_update_object(request.data, filtered_query_set, self.ModelSerializer, activeSchoolID, activeStudentID)

    # @user_permission_3
    # def delete(self, request, activeSchoolID, activeStudentID):
    #     filtered_query_set = self.permittedQuerySet(activeSchoolID, activeStudentID)
    #     return delete_object(request.GET, filtered_query_set)


class GenericListView(GenericBaseView):

    # @user_permission_3
    # def get(self, request, activeSchoolID, activeStudentID):
    #     filtered_query_set = self.permittedQuerySet(activeSchoolID, activeStudentID)
    #     if 'fields__korangle' in request.GET:
    #         self.ModelSerializer = get_model_serializer(self.Model, fields__korangle=request.GET['fields__korangle'], validator=self.validator)
    #     return get_list(request.GET, filtered_query_set, self.ModelSerializer)

    @user_permission_4
    def post(self, request, activeSchoolId, activeStudentIdList):
        data_list = request.data
        return create_object_list(data_list, self.Model, activeSchoolId, activeStudentIdList)

    # @user_permission_3
    # def put(self, request, activeSchoolID, activeStudentID):
    #     filtered_query_set = self.permittedQuerySet(activeSchoolID, activeStudentID)
    #     return update_list(request.data, filtered_query_set, self.ModelSerializer, activeSchoolID, activeStudentID)

    # @user_permission_3
    # def patch(self, request, activeSchoolID, activeStudentID):
    #     filtered_query_set = self.permittedQuerySet(activeSchoolID, activeStudentID)
    #     return partial_update_list(request.data, filtered_query_set, self.ModelSerializer, activeSchoolID, activeStudentID)

    # @user_permission_3
    # def delete(self, request, activeSchoolID, activeStudentID):
    #     filtered_query_set = self.permittedQuerySet(activeSchoolID, activeStudentID)
    #     return delete_list(request.GET, filtered_query_set)
