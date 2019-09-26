
from django.conf.urls import url


from .views import MpBoardReportCardMappingView, MpBoardReportCardMappingListView

urlpatterns = [
    url(r'^'+'report-card-mapping/batch', MpBoardReportCardMappingListView.as_view()),
    url(r'^'+'report-card-mapping', MpBoardReportCardMappingView.as_view()),
]

