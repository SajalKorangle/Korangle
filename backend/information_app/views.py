import json

from common.common_functions import filter_json_func
from common.common_views_3 import CommonView, CommonListView, APIView

#################### MessageType #########################
from decorators import user_permission
from .models import MessageType
from django.apps import apps


CONSTANT_DATABASE_PATH = apps.get_app_config('information_app').path + '/constant_database/'


class MessageTypeView(CommonView, APIView):
    Model = MessageType


class MessageTypeListView(CommonListView, APIView):
    Model = MessageType


class SendUpdateTypeView(APIView):
    @user_permission
    def get(request):
        request_json = request.GET
        json_data = open(CONSTANT_DATABASE_PATH + 'send_update_type.json', )
        content = json.load(json_data)
        result = [x for x in content if filter_json_func(x, request_json)]
        return result
