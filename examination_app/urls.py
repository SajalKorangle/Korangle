
from django.conf.urls import url

from examination_app.views import get_marksheet_view, get_maximumMarksAllowed_view, get_section_student_result_view, create_student_result_view

urlpatterns = []

urlpatterns += [

    url(r'^maximumMarksAllowed$', get_maximumMarksAllowed_view),

    url(r'^sections/(?P<section_id>[0-9]+)/classes/(?P<class_id>[0-9]+)/sessions/(?P<session_id>[0-9]+)/students/(?P<student_id>[0-9]+)/marksheets$', get_marksheet_view),

    url(r'^sections/(?P<section_id>[0-9]+)/students/(?P<student_id>[0-9]+)/results$', get_section_student_result_view),
    url(r'^result$', create_student_result_view),

]


from examination_app.views import ExaminationListOldView, ExaminationOldView

urlpatterns += [
    url(r'^examinations/batch', ExaminationListOldView.as_view()),
    url(r'^examinations', ExaminationOldView.as_view()),
]


from examination_app.views import TestListView, TestView

urlpatterns += [
    url(r'^tests/batch', TestListView.as_view()),
    url(r'^tests/(?P<test_id>[0-9]+)', TestView.as_view()),
    url(r'^tests', TestView.as_view()),
]


from examination_app.views import StudentTestListView

urlpatterns += [
    url(r'^student-tests/batch/(?P<student_test_id_list>[0-9,]+)', StudentTestListView.as_view()),
    url(r'^student-tests/batch', StudentTestListView.as_view()),
]

from examination_app.views import StudentExtraSubFieldListView

urlpatterns += [
    url(r'^student-extra-sub-fields/batch', StudentExtraSubFieldListView.as_view()),
]

from examination_app.views import MpBoardReportCardMappingView

urlpatterns += [
    url(r'^mp-board-report-card-mappings', MpBoardReportCardMappingView.as_view()),
]

from examination_app.views import CCEMarksListView

urlpatterns += [
    url(r'^cce-marks/batch', CCEMarksListView.as_view()),
]


####################################
##### Trying Common Views Below ####
####################################

from examination_app.views import ExaminationView, ExaminationListView

urlpatterns += [
    url(r'^examination/batch', ExaminationListView.as_view()),
    url(r'^examination', ExaminationView.as_view()),
]


from examination_app.views import TestSecondView, TestSecondListView

urlpatterns += [
    url(r'^test-second/batch', TestSecondListView.as_view()),
    url(r'^test-second', TestSecondView.as_view()),
]


from examination_app.views import StudentTestView, StudentTestListView

urlpatterns += [
    url(r'^student-test/batch', StudentTestListView.as_view()),
    url(r'^student-test', StudentTestView.as_view()),
]

