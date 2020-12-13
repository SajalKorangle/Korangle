from django.shortcuts import render

# Create your views here.

from common.common_views_3 import CommonListView, CommonView
from rest_framework.views import APIView

from examination_app.models import MpBoardReportCardMapping, CCEMarks, StudentExtraSubField, ExtraSubField
from subject_app.models import ExtraField
from .models import StudentRemark


########### MpBoardReportCardMapping #############


class ReportCardMappingView(CommonView, APIView):
    Model = MpBoardReportCardMapping
    RelationsToSchool = [
        'parentSchool',
        'parentExaminationJuly__parentSchool',
        'parentExaminationAugust__parentSchool',
        'parentExaminationSeptember__parentSchool',
        'parentExaminationOctober__parentSchool',
        'parentExaminationHalfYearly__parentSchool',
        'parentExaminationDecember__parentSchool',
        'parentExaminationJanuary__parentSchool',
        'parentExaminationFebruary__parentSchool',
        'parentExaminationFinal__parentSchool',
        'parentExaminationQuarterlyHigh__parentSchool',
        'parentExaminationHalfYearlyHigh__parentSchool',
        'parentExaminationFinalHigh__parentSchool',
        'parentExaminationProject__parentSchool'
    ]


class ReportCardMappingListView(CommonListView, APIView):
    Model = MpBoardReportCardMapping
    RelationsToSchool = [
        'parentSchool',
        'parentExaminationJuly__parentSchool',
        'parentExaminationAugust__parentSchool',
        'parentExaminationSeptember__parentSchool',
        'parentExaminationOctober__parentSchool',
        'parentExaminationHalfYearly__parentSchool',
        'parentExaminationDecember__parentSchool',
        'parentExaminationJanuary__parentSchool',
        'parentExaminationFebruary__parentSchool',
        'parentExaminationFinal__parentSchool',
        'parentExaminationQuarterlyHigh__parentSchool',
        'parentExaminationHalfYearlyHigh__parentSchool',
        'parentExaminationFinalHigh__parentSchool',
        'parentExaminationProject__parentSchool'
    ]


########### CCEMarks #############


class CCEMarksView(CommonView, APIView):
    Model = CCEMarks
    RelationsToSchool = ['parentStudent__parentSchool']
    RelationsToStudent = ['parentStudent']


class CCEMarksListView(CommonListView, APIView):
    Model = CCEMarks
    RelationsToSchool = ['parentStudent__parentSchool']
    RelationsToStudent = ['parentStudent']


########### StudentExtraSubField #############


class StudentExtraSubFieldView(CommonView, APIView):
    Model = StudentExtraSubField
    RelationsToSchool = ['parentExamination__parentSchool', 'parentStudent__parentSchool']
    RelationsToStudent = ['parentStudent']


class StudentExtraSubFieldListView(CommonListView, APIView):
    Model = StudentExtraSubField
    RelationsToSchool = ['parentExamination__parentSchool', 'parentStudent__parentSchool']
    RelationsToStudent = ['parentStudent']


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


########### Class Teacher Remark #############


class StudentRemarkView(CommonView, APIView):
    Model = StudentRemark
    RelationsToSchool = ['parentStudent__parentSchool']
    RelationsToStudent = ['parentStudent']



class StudentRemarkListView(CommonListView, APIView):
    Model = StudentRemark
    RelationsToSchool = ['parentStudent__parentSchool']
    RelationsToStudent = ['parentStudent']
