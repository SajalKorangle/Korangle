from common.common_views_3 import CommonView, CommonListView, APIView
from common.common_serializer_interface_3 import create_object
from .models import Error
from decorators import user_permission_3


class ReportErrorView(CommonView, APIView): # only post method is allowed, check if relations is required
    permission_classes = [] # To remove IsAuthenticated permission class
    Model = Error
    permittedMethods = ['post']

    def preValidation(self, request, rawData):
        request.data['user'] = request.user.id

