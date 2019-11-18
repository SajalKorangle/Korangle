from django.shortcuts import render

# Create your views here.

from common.common_views import CommonListView, CommonView
from rest_framework.views import APIView

from examination_app.models import MpBoardReportCardMapping, CCEMarks, StudentExtraSubField, ExtraSubField
from subject_app.models import ExtraField


########### MpBoardReportCardMapping #############


class ReportCardMappingView(CommonView, APIView):
    Model = MpBoardReportCardMapping


class ReportCardMappingListView(CommonListView, APIView):
    Model = MpBoardReportCardMapping


########### CCEMarks #############


class CCEMarksView(CommonView, APIView):
    Model = CCEMarks


class CCEMarksListView(CommonListView, APIView):
    Model = CCEMarks


########### StudentExtraSubField #############


class StudentExtraSubFieldView(CommonView, APIView):
    Model = StudentExtraSubField


class StudentExtraSubFieldListView(CommonListView, APIView):
    Model = StudentExtraSubField


########### ExtraField #############


class ExtraFieldView(CommonView, APIView):
    Model = ExtraField


class ExtraFieldListView(CommonListView, APIView):
    Model = ExtraField


########### ExtraSubField #############


class ExtraSubFieldView(CommonView, APIView):
    Model = ExtraSubField


class ExtraSubFieldListView(CommonListView, APIView):
    Model = ExtraSubField


