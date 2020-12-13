from rest_framework.views import APIView
from common.common_views_3 import CommonView, CommonListView


#################### MessageType #########################
from .models import MessageType

class MessageTypeView(CommonView, APIView):
    Model = MessageType


class MessageTypeListView(CommonListView, APIView):
    Model = MessageType
