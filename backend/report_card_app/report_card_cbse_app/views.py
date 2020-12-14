
from common.common_views_3 import CommonListView, CommonView, APIView
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
    RelationsToSchool = ['parentStudent__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']


class StudentExtraFieldListView(CommonListView, APIView):
    Model = StudentExtraField
    RelationsToSchool = ['parentStudent__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']


########### Class Teacher Remark #############


class StudentRemarkView(CommonView, APIView):
    Model = StudentRemark
    RelationsToSchool = ['parentStudent__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']


class StudentRemarkListView(CommonListView, APIView):
    Model = StudentRemark
    RelationsToSchool = ['parentStudent__parentSchool__id']
    RelationsToStudent = ['parentStudent__id']


########### Report Card Mapping #############


class ReportCardMappingView(CommonView, APIView):
    Model = ReportCardMapping
    RelationsToSchool = [
        'parentSchool__id',
        'parentExaminationPeriodicTest__parentSchool__id',
        'parentExaminationNoteBook__parentSchool__id',
        'parentExaminationSubEnrichment__parentSchool__id',
        'parentExaminationFinalTerm____parentSchool__id'
        ]


class ReportCardMappingListView(CommonListView, APIView):
    Model = ReportCardMapping
    RelationsToSchool = [
        'parentSchool__id',
        'parentExaminationPeriodicTest__parentSchool__id',
        'parentExaminationNoteBook__parentSchool__id',
        'parentExaminationSubEnrichment__parentSchool__id',
        'parentExaminationFinalTerm____parentSchool__id'
        ]