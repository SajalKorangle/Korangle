
import json

from common.common_views import CommonView, CommonListView, APIView
from decorators import user_permission_new
from fees_third_app.business.discount import create_discount_object, create_discount_list

from push_notifications.models import GCMDevice


# Create your views here.


########### Fee Type #############


class GCMDeviceView(CommonView, APIView):
    Model = GCMDevice


class GCMDeviceListView(CommonListView, APIView):
    Model = GCMDevice

