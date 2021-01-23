from django.shortcuts import render

# Create your views here.

from common.common_views_3 import CommonListView, CommonView, APIView

from examination_app.models import MpBoardReportCardMapping, CCEMarks, StudentExtraSubField, ExtraSubField
from subject_app.models import ExtraField
from .models import StudentRemark


########### MpBoardReportCardMapping #############


class ReportCardMappingView(CommonView, APIView):
    Model = MpBoardReportCardMapping
    RelationsToSchool = [
        'parentSchool__id',
        'parentExaminationJuly__parentSchool__id',
        'parentExaminationAugust__parentSchool__id',
        'parentExaminationSeptember__parentSchool__id',
        'parentExaminationOctober__parentSchool__id',
        'parentExaminationHalfYearly__parentSchool__id',
        'parentExaminationDecember__parentSchool__id',
        'parentExaminationJanuary__parentSchool__id',
        'parentExaminationFebruary__parentSchool__id',
        'parentExaminationFinal__parentSchool__id',
        'parentExaminationQuarterlyHigh__parentSchool__id',
        'parentExaminationHalfYearlyHigh__parentSchool__id',
        'parentExaminationFinalHigh__parentSchool__id',
        'parentExaminationProject__parentSchool__id'
    ]


class ReportCardMappingListView(CommonListView, APIView):
    Model = MpBoardReportCardMapping
    RelationsToSchool = [
        'parentSchool__id',
        'parentExaminationJuly__parentSchool__id',
        'parentExaminationAugust__parentSchool__id',
        'parentExaminationSeptember__parentSchool__id',
        'parentExaminationOctober__parentSchool__id',
        'parentExaminationHalfYearly__parentSchool__id',
        'parentExaminationDecember__parentSchool__id',
        'parentExaminationJanuary__parentSchool__id',
        'parentExaminationFebruary__parentSchool__id',
        'parentExaminationFinal__parentSchool__id',
        'parentExaminationQuarterlyHigh__parentSchool__id',
        'parentExaminationHalfYearlyHigh__parentSchool__id',
        'parentExaminationFinalHigh__parentSchool__id',
        'parentExaminationProject__parentSchool__id'
    ]


########### CCEMarks #############


class CCEMarksView(CommonView, APIView):
    Model = CCEMarks
    RelationsToSchool = ['parentStudent__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']


class CCEMarksListView(CommonListView, APIView):
    Model = CCEMarks
    RelationsToSchool = ['parentStudent__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']


########### StudentExtraSubField #############


class StudentExtraSubFieldView(CommonView, APIView):
    Model = StudentExtraSubField
    RelationsToSchool = ['parentExamination__parentSchool__id', 'parentStudent__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']


class StudentExtraSubFieldListView(CommonListView, APIView):
    Model = StudentExtraSubField
    RelationsToSchool = ['parentExamination__parentSchool__id', 'parentStudent__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']


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
    RelationsToSchool = ['parentStudent__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']



class StudentRemarkListView(CommonListView, APIView):
    Model = StudentRemark
    RelationsToSchool = ['parentStudent__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']
