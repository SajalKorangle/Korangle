from common.common_views_3 import CommonView, CommonListView, APIView
from common.common_serializer_interface_3 import create_object
from .models import Error
from decorators import user_permission_3


class ReportErrorView(CommonView, APIView): # only post method is allowed
    permission_classes = [] # To remove IsAuthenticated permission class
    Model = Error
    permittedMethods = ['post']

    @user_permission_3
    def post(self, request, activeSchoolID, activeStudentID):
        data = {}
        data.update(request.data)
        data['user'] = request.user.id
        return create_object(data, self.ModelSerializer, activeSchoolID, activeStudentID)

