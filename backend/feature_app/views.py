

from common.common_views import CommonView, CommonListView, APIView
from decorators import user_permission_new

from .models import Feature

# Create your views here.


########### Feature #############


class FeatureView(CommonView, APIView):
    Model = Feature


class FeatureListView(CommonListView, APIView):
    Model = Feature

