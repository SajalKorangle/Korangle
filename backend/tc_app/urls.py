
from django.conf.urls import url

urlpatterns = []

from tc_app import views

urlpatterns += [

    url(r'^report-card-layout-new/batch', views.TCLayoutListView.as_view()),
    url(r'^report-card-layout-new', views.TCLayoutListView.as_view()),
    url(r'^tc-layout-sharing/batch', views.TCLayoutSharingListView.as_view()),
    url(r'^tc-layout-sharing', views.TCLayoutSharingView.as_view()),
    url(r'^tc-image-assets/batch', views.TCImageAssetsListView.as_view()),
    url(r'^tc-image-assets', views.TCImageAssetsView.as_view()),
    url(r'^transfer-certificate-settings/batch', views.TransferCertificateSettingsListView.as_view()),
    url(r'^transfer-certificate-settings', views.TransferCertificateSettingsView.as_view()),
    url(r'^transfer-certificate-new/batch', views.TransferCertificateNewListView.as_view()),
    url(r'^transfer-certificate-new', views.TransferCertificateNewView.as_view()),
]


