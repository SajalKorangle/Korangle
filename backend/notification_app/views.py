
import json

from common.common_views_3 import CommonView, CommonListView, APIView
from common.common_serializer_interface_3 import create_list, create_object
from decorators import user_permission_3

from push_notifications.models import GCMDevice
from .models import Notification

from .business.send_notification import send_notification


# Create your views here.


########### Fee Type #############


class GCMDeviceView(CommonView, APIView):
    Model = GCMDevice


class GCMDeviceListView(CommonListView, APIView):
    Model = GCMDevice


########### Notification #############


class NotificationView(CommonView, APIView):
    Model = Notification
    RelationsToSchool = ['parentSchool']

    @user_permission_3
    def post(self, request, *args, **kwargs):
        send_notification([].append(request.data))
        return create_object(request.data, self.Model, self.ModelSerializer, *args, **kwargs)


class NotificationListView(CommonListView, APIView):
    Model = Notification
    RelationsToSchool = ['parentSchool']

    @user_permission_3
    def post(self, request, *args, **kwargs):
        send_notification(request.data)
        return create_list(request.data, self.Model, self.ModelSerializer, *args, **kwargs)

