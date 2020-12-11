# from common.common_views_file import CommonView, CommonListView
from common.common_view_3 import CommonView, CommonListView
from rest_framework.views import APIView
from id_card_app.models import IdCardLayout


# IdCardLayout
class IdCardLayoutView(CommonView, APIView):
    Model = IdCardLayout
    RelationsToSchool = ['parentSchool']


class IdCardLayoutListView(CommonListView, APIView):
    Model = IdCardLayout
    RelationsToSchool = ['parentSchool']
