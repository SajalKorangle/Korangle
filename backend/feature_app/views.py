

from common.common_views_3 import CommonView, CommonListView, APIView

from .models import Feature

# Create your views here.


########### Feature #############


class FeatureView(CommonView, APIView):
    Model = Feature


class FeatureListView(CommonListView, APIView):
    Model = Feature

