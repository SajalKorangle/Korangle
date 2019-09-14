from django.shortcuts import render

# Create your views here.

from common.common_views import CommonListView, CommonView
from rest_framework.views import APIView

from examination_app.models import MpBoardReportCardMapping


########### MpBoardReportCardMapping #############


class MpBoardReportCardMappingView(CommonView, APIView):
    Model = MpBoardReportCardMapping


class MpBoardReportCardMappingListView(CommonListView, APIView):
    Model = MpBoardReportCardMapping


