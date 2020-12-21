from common.common_views_file import CommonView, CommonListView
from rest_framework.views import APIView
from report_card_app.models import ReportCardLayout, ReportCardLayoutNew, ImageAssets


# ReportCardLayout
class ReportCardLayoutView(CommonView, APIView):
    Model = ReportCardLayout


class ReportCardLayoutListView(CommonListView, APIView):
    Model = ReportCardLayout

class ReportCardLayoutNewView(CommonView, APIView):
    Model = ReportCardLayoutNew

class ReportCardLayoutNewListView(CommonListView, APIView):
    Model = ReportCardLayoutNew

class ImageAssetsView(CommonView, APIView):
    Model = ImageAssets

class ImageAssetsListView(CommonListView, APIView):
    Model = ImageAssets

