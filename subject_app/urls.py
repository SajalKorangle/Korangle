
from django.conf.urls import url

from subject_app.views import get_subjects_view

urlpatterns = []

urlpatterns += [
    url(r'^$', get_subjects_view)
]
