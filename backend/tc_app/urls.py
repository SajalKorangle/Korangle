
from django.conf.urls import url

urlpatterns = []

from tc_app import views

urlpatterns += [

    url(r'^report-card-layout-new/batch', views.TCLayoutListView.as_view()),
    url(r'^report-card-layout-new', views.TCLayoutListView.as_view()),
    url(r'^layout-sharing/batch', views.LayoutSharingListView.as_view()),
    url(r'^layout-sharing', views.LayoutSharingView.as_view()),
    url(r'^image-assets/batch', views.ImageAssetsListView.as_view()),
    url(r'^image-assets', views.ImageAssets.as_view()),

]


