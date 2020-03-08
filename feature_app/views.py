

from common.common_views import CommonView, CommonListView, APIView
from decorators import user_permission_new

from .models import Feature

# Create your views here.


########### Feature #############
from feature_app.business.photo import partial_update_photo


class FeatureView(CommonView, APIView):
    Model = Feature


class FeatureListView(CommonListView, APIView):
    Model = Feature


########### Feature Photo #############
from feature_app.business.feature_photo import create_object


class FeaturePhotoView(CommonView, APIView):
    Model = Feature

    @user_permission_new
    def post(self, request):
        return create_object(request, self.Model, self.ModelSerializer)


class FeaturePhotoListView(CommonListView, APIView):
    Model = Feature

