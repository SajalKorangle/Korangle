
from django.conf.urls import url

from .views import \
    TermView, TermListView, \
    ExtraFieldView, ExtraFieldListView, \
    StudentExtraFieldView, StudentExtraFieldListView, \
    ClassTeacherRemarkView, ClassTeacherRemarkListView, \
    ReportCardMappingView, ReportCardMappingListView

urlpatterns = []

urlpatterns += [

    url(r'^' + 'term/batch', TermListView.as_view()),
    url(r'^' + 'term', TermView.as_view()),

    url(r'^' + 'extra-field/batch', ExtraFieldListView.as_view()),
    url(r'^' + 'extra-field', ExtraFieldView.as_view()),

    url(r'^' + 'student-extra-field/batch', StudentExtraFieldListView.as_view()),
    url(r'^' + 'student-extra-field', StudentExtraFieldView.as_view()),

    url(r'^' + 'class-teacher-remark/batch', ClassTeacherRemarkListView.as_view()),
    url(r'^' + 'class-teacher-remark', ClassTeacherRemarkView.as_view()),

    url(r'^' + 'report-card-mapping/batch', ReportCardMappingListView.as_view()),
    url(r'^' + 'report-card-mapping', ReportCardMappingView.as_view()),

]

