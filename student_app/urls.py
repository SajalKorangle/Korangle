
# greetings/urls.py
from django.conf.urls import url

urlpatterns = []

########## Update Profile #############
from .views import get_class_section_student_list_view, get_student_profile_view, update_student_view, delete_student_view
urlpatterns += [
	url(r'^class_section_student_list/', get_class_section_student_list_view),
	url(r'^get_student_profile/', get_student_profile_view),
	url(r'^update_student_profile/', update_student_view),
	url(r'^delete_student/', delete_student_view),
]

########## View All ##############
from .views import get_student_profile_list_and_class_section_list_view
urlpatterns += [
	url(r'^get_student_profile_list_and_class_section_list', get_student_profile_list_and_class_section_list_view),
]

########## New Student ###########
from .views import create_new_student_view
urlpatterns += [
	url(r'^create_new_student/', create_new_student_view),
]

######### Promote Student #########
from .views import get_student_list_session_class_wise_view, promote_student_list_view
urlpatterns += [
		url(r'^student_list_session_class_wise/', get_student_list_session_class_wise_view),
		url(r'^promote_student_list/', promote_student_list_view),
]
