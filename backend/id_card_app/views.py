from common.common_views_3 import CommonView, CommonListView, APIView
from id_card_app.models import IdCardLayout


# IdCardLayout
class IdCardLayoutView(CommonView, APIView):
    Model = IdCardLayout
    RelationsToSchool = ['parentSchool__id']


class IdCardLayoutListView(CommonListView, APIView):
    Model = IdCardLayout
    RelationsToSchool = ['parentSchool__id']
