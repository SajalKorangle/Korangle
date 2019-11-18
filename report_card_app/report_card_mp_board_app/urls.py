
from django.conf.urls import url


from .views import ReportCardMappingView, ReportCardMappingListView

urlpatterns = [
    url(r'^'+'report-card-mapping/batch', ReportCardMappingListView.as_view()),
    url(r'^'+'report-card-mapping', ReportCardMappingView.as_view()),
]

from .views import CCEMarksView, CCEMarksListView

urlpatterns = [
    url(r'^'+'cce-marks/batch', CCEMarksListView.as_view()),
    url(r'^'+'cce-marks', CCEMarksView.as_view()),
]

from .views import StudentExtraSubFieldView, StudentExtraSubFieldListView

urlpatterns = [
    url(r'^'+'student-extra-sub-field/batch', StudentExtraSubFieldListView.as_view()),
    url(r'^'+'student-extra-sub-field', StudentExtraSubFieldView.as_view()),
]

from .views import ExtraFieldView, ExtraFieldListView

urlpatterns = [
    url(r'^'+'extra-field/batch', ExtraFieldListView.as_view()),
    url(r'^'+'extra-field', ExtraFieldView.as_view()),
]

from .views import ExtraSubFieldView, ExtraSubFieldListView

urlpatterns = [
    url(r'^'+'extra-sub-field/batch', ExtraSubFieldListView.as_view()),
    url(r'^'+'extra-sub-field', ExtraSubFieldView.as_view()),
]

