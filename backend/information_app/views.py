from common.common_views_3 import CommonView, CommonListView, APIView


#################### MessageType #########################
from .models import MessageType

class MessageTypeView(CommonView, APIView):
    Model = MessageType


class MessageTypeListView(CommonListView, APIView):
    Model = MessageType
