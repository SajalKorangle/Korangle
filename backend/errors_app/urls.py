
from django.conf.urls import url

urlpatterns = []

from errors_app.views import ReportErrorView

urlpatterns += [
    url(r'^report-error', ReportErrorView.as_view()),
]

