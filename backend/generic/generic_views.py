
from rest_framework.views import APIView
from backend.common.common_serializer_interface_3 import delete_object

from decorators import user_permission_4


from .generic_serializer_interface import create_object, create_object_list, get_object, get_object_list, update_object, update_object_list, delete_object, delete_object_list
from django.apps import apps

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
        return get_object(request.GET.get('__query__', {}), self.Model, activeSchoolId, activeStudentIdList)

    @user_permission_4
    def post(self, request, activeSchoolId, activeStudentIdList):
        return create_object(request.data, self.Model, activeSchoolId, activeStudentIdList)

    @user_permission_4
    def put(self, request, activeSchoolId, activeStudentIdList):
        return update_object(request.data, self.Model, activeSchoolId, activeStudentIdList)

    @user_permission_4
    def patch(self, request, activeSchoolId, activeStudentIdList):
        return update_object(request.data, self.Model, activeSchoolId, activeStudentIdList, partial=True)

    @user_permission_4
    def delete(self, request, activeSchoolId, activeStudentIdList):
        return delete_object(request.GET.get('__data__', {}), self.Model, activeSchoolId, activeStudentIdList)


class GenericListView(GenericBaseView):

    @user_permission_4
    def get(self, request, activeSchoolId, activeStudentIdList):
        return get_object_list(request.GET.get('__query__', {}), self.Model, activeSchoolId, activeStudentIdList)

    @user_permission_4
    def post(self, request, activeSchoolId, activeStudentIdList):
        data_list = request.data
        return create_object_list(data_list, self.Model, activeSchoolId, activeStudentIdList)

    @user_permission_4
    def put(self, request, activeSchoolId, activeStudentIdList):
        return update_object_list(request.data, self.Model, activeSchoolId, activeStudentIdList)

    @user_permission_4
    def patch(self, request, activeSchoolId, activeStudentIdList):
        return update_object_list(request.data, self.Model, activeSchoolId, activeStudentIdList, partial=True)

    @user_permission_4
    def delete(self, request, activeSchoolId, activeStudentIdList):
        return delete_object_list(request.GET.get('__data__', {}), self.Model, activeSchoolId, activeStudentIdList)
