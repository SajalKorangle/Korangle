
from django.conf.urls import url

from examination_app.views import get_marksheet_view, get_maximumMarksAllowed_view, get_section_student_result_view, create_student_result_view

urlpatterns = []

urlpatterns += [

    url(r'^maximumMarksAllowed$', get_maximumMarksAllowed_view),

    url(r'^sections/(?P<section_id>[0-9]+)/students/(?P<student_id>[0-9]+)/marksheets$', get_marksheet_view),

    url(r'^sections/(?P<section_id>[0-9]+)/students/(?P<student_id>[0-9]+)/results$', get_section_student_result_view),
    url(r'^result$', create_student_result_view),

]
