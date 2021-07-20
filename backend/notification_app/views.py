
import json

from common.common_views_3 import CommonView, CommonListView, APIView
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
    # RelationsToSchool = ['parentSchool__id']


class NotificationListView(CommonListView, APIView):
    Model = Notification
    # RelationsToSchool = ['parentSchool__id']
