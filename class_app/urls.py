from django.conf.urls import url

from .views import get_class_section_list_view

urlpatterns = [
    url(r'^class_section_list/', get_class_section_list_view),
]