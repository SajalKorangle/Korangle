from common.common_views_3 import CommonView, CommonListView, APIView, common_json_view_function

#################### MessageType #########################
from decorators import user_permission_3
from .models import MessageType


class MessageTypeView(CommonView, APIView):
    Model = MessageType


class MessageTypeListView(CommonListView, APIView):
    Model = MessageType


class SendUpdateTypeView(APIView):
    @user_permission_3
    def get(self, request, activeSchoolID, activeStudentID):
        return common_json_view_function(request.GET, "information_app", 'send_update_type.json')
