
from django.conf.urls import url, include

urlpatterns = []

from report_card_app.views import ReportCardLayoutView, ReportCardLayoutListView, ReportCardLayoutNewView, ReportCardLayoutNewListView, LayoutSharingView, LayoutSharingListView, ImageAssetsView, ImageAssetsListView

urlpatterns += [

    url(r'^report-card-layout-new/batch', ReportCardLayoutNewListView.as_view()),
    url(r'^report-card-layout-new', ReportCardLayoutNewView.as_view()),
    url(r'^layout-sharing/batch', LayoutSharingListView.as_view()),
    url(r'^layout-sharing', LayoutSharingView.as_view()),
    url(r'^image-assets/batch', ImageAssetsListView.as_view()),
    url(r'^image-assets', ImageAssetsView.as_view()),
    url(r'^report-card-layout/batch', ReportCardLayoutListView.as_view()),
    url(r'^report-card-layout', ReportCardLayoutView.as_view()),

]

# url for nested apps
urlpatterns += [

    url(r'^cbse/', include('report_card_app.report_card_cbse_app.urls')),
    url(r'^mp-board/', include('report_card_app.report_card_mp_board_app.urls')),

]

