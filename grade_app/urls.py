from django.conf.urls import url

urlpatterns = []

from grade_app.views import GradeView, GradeListView

#Grade
urlpatterns += [
    url(r'^grades/batch', GradeListView.as_view()),
    url(r'^grades', GradeView.as_view()),
]

from grade_app.views import SubGradeView, SubGradeListView

#SubGrade
urlpatterns += [
    url(r'^sub-grades/batch', SubGradeListView.as_view()),
    url(r'^sub-grades', SubGradeView.as_view()),
]

from grade_app.views import StudentSubGradeView, StudentSubGradeListView

#StudentSubGrade
urlpatterns += [
    url(r'^student-sub-grades/batch', StudentSubGradeListView.as_view()),
    url(r'^student-sub-grades', StudentSubGradeView.as_view()),
]