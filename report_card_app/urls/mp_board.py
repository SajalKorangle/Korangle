
from report_card_app.urls import urlpatterns

from django.conf.urls import url

mp_board_url = 'mp-board/'


from report_card_app.views.mp_board import MpBoardReportCardMappingView, MpBoardReportCardMappingListView

urlpatterns += [
    url(r'^'+mp_board_url+'report-card-mapping/batch', MpBoardReportCardMappingListView.as_view()),
    url(r'^'+mp_board_url+'report-card-mapping', MpBoardReportCardMappingView.as_view()),
]

