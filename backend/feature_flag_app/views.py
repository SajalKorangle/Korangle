
from common.json_encoding import make_dict_list_serializable
from feature_flag_app.models import FeatureFlag
from rest_framework_jwt.views import JSONWebTokenAPIView
from rest_framework.response import Response


class FeatureFlagListView(JSONWebTokenAPIView):

    def get(self, request):

        return Response({"data": make_dict_list_serializable(list(FeatureFlag.objects.all().values()))})
