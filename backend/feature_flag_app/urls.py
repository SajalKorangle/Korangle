
from django.conf.urls import url
from feature_flag_app.views import FeatureFlagListView

urlpatterns = [
	url(r'^get-feature-flag-list/', FeatureFlagListView.as_view()),
]
