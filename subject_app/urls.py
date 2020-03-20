
from django.conf.urls import url

from subject_app.views import get_subjects_view

urlpatterns = []

urlpatterns += [
    url(r'^$', get_subjects_view)
]


from subject_app.views import SubjectOldListView

urlpatterns += [
    url(r'^subjects', SubjectOldListView.as_view()),
]


from subject_app.views import ClassSubjectListOldView, ClassSubjectOldView

urlpatterns += [
    url(r'^class-subjects/batch', ClassSubjectListOldView.as_view()),
    url(r'^class-subjects/(?P<class_subject_id>[0-9]+)', ClassSubjectOldView.as_view()),
    url(r'^class-subjects', ClassSubjectOldView.as_view()),
]


from subject_app.views import StudentSubjectListOldView, StudentSubjectOldView

urlpatterns += [
    url(r'^student-subjects/batch/(?P<student_subject_id_list>[0-9,]+)', StudentSubjectListOldView.as_view()),
    url(r'^student-subjects/batch', StudentSubjectListOldView.as_view()),
    url(r'^student-subjects/(?P<student_subject_id>[0-9]+)', StudentSubjectOldView.as_view()),
    url(r'^student-subjects', StudentSubjectOldView.as_view()),
]

from subject_app.views import ExtraFieldListView

urlpatterns += [
    url(r'^extra-fields/batch', ExtraFieldListView.as_view()),
]

from subject_app.views import ExtraSubFieldListView

urlpatterns += [
    url(r'^extra-sub-fields/batch', ExtraSubFieldListView.as_view()),
]


####################################
##### Trying Common Views Below ####
####################################

from subject_app.views import SubjectView, SubjectListView

urlpatterns += [
    url(r'^subject/batch', SubjectListView.as_view()),
    url(r'^subject', SubjectView.as_view()),
]


from subject_app.views import ClassSubjectView, ClassSubjectListView

urlpatterns += [
    url(r'^class-subject/batch', ClassSubjectListView.as_view()),
    url(r'^class-subject', ClassSubjectView.as_view()),
]


from subject_app.views import StudentSubjectView, StudentSubjectListView

urlpatterns += [
    url(r'^student-subject/batch', StudentSubjectListView.as_view()),
    url(r'^student-subject', StudentSubjectView.as_view()),
]

