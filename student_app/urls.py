
# greetings/urls.py
from django.conf.urls import url

urlpatterns = []

########## Update Profile #############
from .views import get_class_section_student_list_view, get_student_profile_view, update_student_view, delete_student_view
urlpatterns += [
    url(r'^class_section_student_list/school/(?P<school_id>[0-9]+)/sessions/(?P<session_id>[0-9]+)', get_class_section_student_list_view),
    url(r'^get_student_profile/', get_student_profile_view),
    url(r'^update_student_profile/', update_student_view),
    url(r'^delete_student/', delete_student_view),
]

########## New Student ###########
from .views import create_new_student_view
urlpatterns += [
    url(r'^create_new_student/', create_new_student_view),
]

####################################
####### Trying Rest Api Below ######
####################################

######## Student Full Profile ######
from .views import StudentFullProfileView
urlpatterns += [
    url(r'^school/(?P<school_id>[0-9]+)/student-full-profiles', StudentFullProfileView.as_view()),
]

######## Student Mini Profile ######
from .views import StudentMiniProfileView
urlpatterns += [
    url(r'^school/(?P<school_id>[0-9]+)/student-mini-profiles', StudentMiniProfileView.as_view()),
]

######## Student Section ###########
from .views import StudentSectionListView, StudentSectionView
urlpatterns += [
    url(r'^student-sections/(?P<student_section_id>[0-9]+)', StudentSectionView.as_view()),
    url(r'^student-sections/batch', StudentSectionListView.as_view()),
]
