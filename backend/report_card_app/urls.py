
from django.conf.urls import url, include

urlpatterns = []

from report_card_app.views import ReportCardLayoutView, ReportCardLayoutListView

urlpatterns += [

    url(r'^report-card-layout/batch', ReportCardLayoutListView.as_view()),
    url(r'^report-card-layout', ReportCardLayoutView.as_view()),

]

# url for nested apps
urlpatterns += [

    url(r'^cbse/', include('report_card_app.report_card_cbse_app.urls')),
    url(r'^mp-board/', include('report_card_app.report_card_mp_board_app.urls')),

]

