
from django.conf.urls import url

from subject_app.views import get_subjects_view

urlpatterns = []

urlpatterns += [
    url(r'^$', get_subjects_view)
]


from subject_app.views import SubjectListView

urlpatterns += [
    url(r'^subjects', SubjectListView.as_view()),
]


from subject_app.views import ClassSubjectListView, ClassSubjectView

urlpatterns += [
    url(r'^class-subjects/batch', ClassSubjectListView.as_view()),
    url(r'^class-subjects/(?P<class_subject_id>[0-9]+)', ClassSubjectView.as_view()),
    url(r'^class-subjects', ClassSubjectView.as_view()),
]


from subject_app.views import StudentSubjectListView, StudentSubjectView

urlpatterns += [
    url(r'^student-subjects/batch/(?P<student_subject_id_list>[0-9,]+)', StudentSubjectListView.as_view()),
    url(r'^student-subjects/batch', StudentSubjectListView.as_view()),
    url(r'^student-subjects/(?P<student_subject_id>[0-9]+)', StudentSubjectView.as_view()),
    url(r'^student-subjects', StudentSubjectView.as_view()),
]
