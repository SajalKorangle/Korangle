
from common.common_views_3 import CommonListView, CommonView
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
    RelationsToSchool = ['parentStudent__parentSchool']
    RelationsToStudent = ['parentStudent']


class StudentExtraFieldListView(CommonListView, APIView):
    Model = StudentExtraField
    RelationsToSchool = ['parentStudent__parentSchool']
    RelationsToStudent = ['parentStudent']


########### Class Teacher Remark #############


class StudentRemarkView(CommonView, APIView):
    Model = StudentRemark
    RelationsToSchool = ['parentStudent__parentSchool']
    RelationsToStudent = ['parentStudent']


class StudentRemarkListView(CommonListView, APIView):
    Model = StudentRemark
    RelationsToSchool = ['parentStudent__parentSchool']
    RelationsToStudent = ['parentStudent']


########### Report Card Mapping #############


class ReportCardMappingView(CommonView, APIView):
    Model = ReportCardMapping
    RelationsToSchool = ['parentSchool', 'parentExaminationPeriodicTest__parentSchool', 'parentExaminationNoteBook__parentSchool', 'parentExaminationSubEnrichment__parentSchool', 'parentExaminationFinalTerm____parentSchool']


class ReportCardMappingListView(CommonListView, APIView):
    Model = ReportCardMapping
    RelationsToSchool = ['parentSchool', 'parentExaminationPeriodicTest__parentSchool', 'parentExaminationNoteBook__parentSchool', 'parentExaminationSubEnrichment__parentSchool', 'parentExaminationFinalTerm__parentSchool']
