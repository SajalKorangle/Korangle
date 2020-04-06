
from common.common_views import CommonListView, CommonView
from rest_framework.views import APIView
from .models  import Term, ExtraField, StudentExtraField, StudentRemark, ReportCardMapping


########### Term #############


class TermView(CommonView, APIView):
    Model = Term


class TermListView(CommonListView, APIView):
    Model = Term


########### Extra Field #############


class ExtraFieldView(CommonView, APIView):
    Model = ExtraField


class ExtraFieldListView(CommonListView, APIView):
    Model = ExtraField


########### Student Extra Field #############


class StudentExtraFieldView(CommonView, APIView):
    Model = StudentExtraField


class StudentExtraFieldListView(CommonListView, APIView):
    Model = StudentExtraField


########### Class Teacher Remark #############


class StudentRemarkView(CommonView, APIView):
    Model = StudentRemark


class StudentRemarkListView(CommonListView, APIView):
    Model = StudentRemark


########### Report Card Mapping #############


class ReportCardMappingView(CommonView, APIView):
    Model = ReportCardMapping


class ReportCardMappingListView(CommonListView, APIView):
    Model = ReportCardMapping


