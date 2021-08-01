
from django.conf.urls import url, include

urlpatterns = []

from . import views

urlpatterns += [

    url(r'^layout/batch', views.LayoutListView.as_view()),
    url(r'^layout-sharing/batch', views.LayoutSharingListView.as_view()),
    url(r'^layout-sharing', views.LayoutSharingView.as_view()),
    url(r'^layout', views.LayoutView.as_view()),
    url(r'^image-assets/batch', views.ImageAssetsListView.as_view()),
    url(r'^image-assets', views.ImageAssetsView.as_view()),

]
