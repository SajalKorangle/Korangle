from common.common_views_file import CommonView, CommonListView
from rest_framework.views import APIView
from report_card_app.models import ReportCardLayout


# ReportCardLayout
class ReportCardLayoutView(CommonView, APIView):
    Model = ReportCardLayout


class ReportCardLayoutListView(CommonListView, APIView):
    Model = ReportCardLayout

