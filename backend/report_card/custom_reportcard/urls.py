
from django.conf.urls import url

urlpatterns = []

from report_card.custom_reportcard.views import LayoutView, LayoutListView

urlpatterns += [
    url(r'^layouts/batch', LayoutListView.as_view()),
    url(r'^layouts', LayoutView.as_view()),
]


from report_card.custom_reportcard.views import LayoutExamColumnView, LayoutExamColumnListView

urlpatterns += [
    url(r'^layout-exam-columns/batch', LayoutExamColumnListView.as_view()),
    url(r'^layout-exam-columns', LayoutExamColumnView.as_view()),
]

from report_card.custom_reportcard.views import StudentRemarksView, StudentRemarksListView

urlpatterns += [
    url(r'^student-remarks/batch',StudentRemarksListView.as_view()),
    url(r'^student-remarks',StudentRemarksView.as_view()),
]



from report_card.custom_reportcard.views import ClassLayoutView, ClassLayoutListView

urlpatterns += [
    url(r'^class-layouts/batch',ClassLayoutListView.as_view()),
    url(r'^class-layouts',ClassLayoutView.as_view()),
]



from report_card.custom_reportcard.views import LayoutSubGradeView, LayoutSubGradeListView

urlpatterns += [
    url(r'^layout-sub-grades/batch',LayoutSubGradeListView.as_view()),
    url(r'^layout-sub-grades',LayoutSubGradeView.as_view()),
]



from report_card.custom_reportcard.views import LayoutGradeView, LayoutGradeListView

urlpatterns += [
    url(r'^layout-grades/batch',LayoutGradeListView.as_view()),
    url(r'^layout-grades',LayoutGradeView.as_view()),
]


