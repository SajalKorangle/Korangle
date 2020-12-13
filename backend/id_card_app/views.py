# from common.common_views_file import CommonView, CommonListView
from common.common_views_3 import CommonView, CommonListView, APIView
from id_card_app.models import IdCardLayout


# IdCardLayout
class IdCardLayoutView(CommonView, APIView):
    Model = IdCardLayout
    RelationsToSchool = ['parentSchool']


class IdCardLayoutListView(CommonListView, APIView):
    Model = IdCardLayout
    RelationsToSchool = ['parentSchool']
