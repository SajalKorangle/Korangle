from django.conf.urls import url

from .views import get_class_section_list_view, ClassView

urlpatterns = [
    url(r'^class_section_list/sessions/(?P<session_id>[0-9]+)', get_class_section_list_view),

    url(r'^classes$', ClassView.as_view()),
]