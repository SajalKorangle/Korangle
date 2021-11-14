
from rest_framework.views import APIView

from decorators import user_permission_4


from .generic_serializer_interface import GenericSerializerInterface
from django.apps import apps

from django.db import transaction as db_transaction

########### Common View ########


class GenericBaseView(APIView):

    Model = None

    def initial(self, request, *args, **kwargs):
        request.GET._mutable = True
        model = apps.get_model(request.GET['app_name'], request.GET['model_name'])
        del request.GET['app_name']
        del request.GET['model_name']
        request.GET._mutable = False
        self.Model = model
        super().initial(request, *args, **kwargs)


class GenericView(GenericBaseView):

    @user_permission_4
    def get(self, request, activeSchoolId, activeStudentIdList):
        return GenericSerializerInterface(request.GET.get('__query__', {}), self.Model, activeSchoolId, activeStudentIdList).get_object()

    @user_permission_4
    @db_transaction.atomic
    def post(self, request, activeSchoolId, activeStudentIdList):
        return GenericSerializerInterface(request.data, self.Model, activeSchoolId, activeStudentIdList).create_object()

    @user_permission_4
    @db_transaction.atomic
    def put(self, request, activeSchoolId, activeStudentIdList):
        return GenericSerializerInterface(request.data, self.Model, activeSchoolId, activeStudentIdList).update_object()

    @user_permission_4
    @db_transaction.atomic
    def patch(self, request, activeSchoolId, activeStudentIdList):
        return GenericSerializerInterface(request.data, self.Model, activeSchoolId, activeStudentIdList, partial=True).update_object()

    @user_permission_4
    @db_transaction.atomic
    def delete(self, request, activeSchoolId, activeStudentIdList):
        return GenericSerializerInterface(request.GET.get('__query__', {}), self.Model, activeSchoolId, activeStudentIdList).delete_object()


class GenericListView(GenericBaseView):

    @user_permission_4
    def get(self, request, activeSchoolId, activeStudentIdList):
        return GenericSerializerInterface(request.GET.get('__query__', {}), self.Model, activeSchoolId, activeStudentIdList).get_object_list()

    @user_permission_4
    @db_transaction.atomic
    def post(self, request, activeSchoolId, activeStudentIdList):
        return GenericSerializerInterface(request.data, self.Model, activeSchoolId, activeStudentIdList).create_object_list()

    @user_permission_4
    @db_transaction.atomic
    def put(self, request, activeSchoolId, activeStudentIdList):
        return GenericSerializerInterface(request.data, self.Model, activeSchoolId, activeStudentIdList).update_object_list()

    @user_permission_4
    @db_transaction.atomic
    def patch(self, request, activeSchoolId, activeStudentIdList):
        return GenericSerializerInterface(request.data, self.Model, activeSchoolId, activeStudentIdList, partial=True).update_object_list()

    @user_permission_4
    @db_transaction.atomic
    def delete(self, request, activeSchoolId, activeStudentIdList):
        return GenericSerializerInterface(request.GET.get('__query__', {}), self.Model, activeSchoolId, activeStudentIdList).delete_object_list()
