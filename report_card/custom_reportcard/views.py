
from rest_framework.views import APIView
from common.common_views import CommonView, CommonListView


from report_card.custom_reportcard.models import Layout

class LayoutView(CommonView, APIView):
    Model = Layout

class LayoutListView(CommonListView, APIView):
    Model = Layout

from report_card.custom_reportcard.models import LayoutExamColumn

class LayoutExamColumnView(CommonView,APIView):
    Model = LayoutExamColumn

class LayoutExamColumnListView(CommonListView,APIView):
    Model = LayoutExamColumn

from report_card.custom_reportcard.models import StudentRemarks

class StudentRemarksView(CommonView,APIView):
    Model = StudentRemarks

class StudentRemarksListView(CommonListView,APIView):
    Model = StudentRemarks