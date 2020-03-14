
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



from report_card.custom_reportcard.models import LayoutGrade

class LayoutGradeView(CommonView,APIView):
    Model = LayoutGrade

class LayoutGradeListView(CommonListView,APIView):
    Model = LayoutGrade



from report_card.custom_reportcard.models import LayoutSubGrade

class LayoutSubGradeView(CommonView,APIView):
    Model = LayoutSubGrade

class LayoutSubGradeListView(CommonListView,APIView):
    Model = LayoutSubGrade




from report_card.custom_reportcard.models import ClassLayout

class ClassLayoutView(CommonView,APIView):
    Model = ClassLayout

class ClassLayoutListView(CommonListView,APIView):
    Model = ClassLayout


    


