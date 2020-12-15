
from django.conf.urls import url

urlpatterns = []

from feature_app.views import FeatureView, FeatureListView

urlpatterns += [
    url(r'^feature/batch', FeatureListView.as_view()),
    url(r'^feature', FeatureView.as_view()),
]

