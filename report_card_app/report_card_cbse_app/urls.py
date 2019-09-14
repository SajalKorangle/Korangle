
from django.conf.urls import url

from report_card_app.urls import urlpatterns

from .views import \
    TermView, TermListView, \
    ExtraFieldView, ExtraFieldListView, \
    StudentExtraFieldView, StudentExtraFieldListView, \
    ClassTeacherRemarkView, ClassTeacherRemarkListView, \
    ReportCardMappingView, ReportCardMappingListView


cbse_url = 'cbse/'


urlpatterns += [

    url(r'^' + cbse_url + 'term/batch', TermListView.as_view()),
    url(r'^' + cbse_url + 'term', TermView.as_view()),

    url(r'^' + cbse_url + 'extra-field/batch', ExtraFieldListView.as_view()),
    url(r'^' + cbse_url + 'extra-field', ExtraFieldView.as_view()),

    url(r'^' + cbse_url + 'student-extra-field/batch', StudentExtraFieldListView.as_view()),
    url(r'^' + cbse_url + 'student-extra-field', StudentExtraFieldView.as_view()),

    url(r'^' + cbse_url + 'class-teacher-remark/batch', ClassTeacherRemarkListView.as_view()),
    url(r'^' + cbse_url + 'class-teacher-remark', ClassTeacherRemarkView.as_view()),

    url(r'^' + cbse_url + 'report-card-mapping/batch', ReportCardMappingListView.as_view()),
    url(r'^' + cbse_url + 'report-card-mapping', ReportCardMappingView.as_view()),

]

