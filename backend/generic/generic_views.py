
from rest_framework.views import APIView

from decorators import user_permission_4


from .generic_serializer_interface import GenericSerializerInterface
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


# class GenericView(GenericBaseView):

#     @user_permission_4
#     def get(self, request, activeSchoolId, activeStudentIdList):
#         return GenericSerializerInterface(request.GET.get('__query__', {}), self.Model, activeSchoolId, activeStudentIdList).get_object()

#     @user_permission_4
#     def post(self, request, activeSchoolId, activeStudentIdList):
#         return GenericSerializerInterface(request.data, self.Model, activeSchoolId, activeStudentIdList).create_object()

#     @user_permission_4
#     def put(self, request, activeSchoolId, activeStudentIdList):
#         return GenericSerializerInterface(request.data, self.Model, activeSchoolId, activeStudentIdList).update_object()

#     @user_permission_4
#     def patch(self, request, activeSchoolId, activeStudentIdList):
#         return GenericSerializerInterface(request.data, self.Model, activeSchoolId, activeStudentIdList, partial=True).update_object()

    # @user_permission_4
    # def delete(self, request, activeSchoolId, activeStudentIdList):
    #     return delete_object(request.GET.get('__data__', {}), self.Model, activeSchoolId, activeStudentIdList)


class GenericListView(GenericBaseView):

    @user_permission_4
    def get(self, request, activeSchoolId, activeStudentIdList):
        return GenericSerializerInterface(request.GET.get('__query__', {}), self.Model, activeSchoolId, activeStudentIdList).get_object_list()

    @user_permission_4
    def post(self, request, activeSchoolId, activeStudentIdList):
        return GenericSerializerInterface(request.data, self.Model, activeSchoolId, activeStudentIdList).create_object_list()

    @user_permission_4
    def put(self, request, activeSchoolId, activeStudentIdList):
        return GenericSerializerInterface(request.data, self.Model, activeSchoolId, activeStudentIdList).update_object_list()

    @user_permission_4
    def patch(self, request, activeSchoolId, activeStudentIdList):
        return GenericSerializerInterface(request.data, self.Model, activeSchoolId, activeStudentIdList, partial=True).update_object_list()

    @user_permission_4
    def delete(self, request, activeSchoolId, activeStudentIdList):
        return GenericSerializerInterface(request.GET.get('__query__', {}), self.Model, activeSchoolId, activeStudentIdList).delete_object_list()
