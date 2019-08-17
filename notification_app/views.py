
import json

from common.common_views import CommonView, CommonListView, APIView
from decorators import user_permission_new

from push_notifications.models import GCMDevice
from .models import Notification

from .business.notification import create_notification_list, create_notification_object, send_notification


# Create your views here.


########### Fee Type #############


class GCMDeviceView(CommonView, APIView):
    Model = GCMDevice


class GCMDeviceListView(CommonListView, APIView):
    Model = GCMDevice


########### Notification #############


class NotificationView(CommonView, APIView):
    Model = Notification

    @user_permission_new
    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        send_notification(data)
        return create_notification_object(data, self.Model, self.ModelSerializer)


class NotificationListView(CommonListView, APIView):
    Model = Notification

    @user_permission_new
    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        send_notification([].append(data))
        return create_notification_list(data, self.Model, self.ModelSerializer)

