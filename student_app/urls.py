
# greetings/urls.py
from django.conf.urls import url

# from .views import get_student_list_session_class_wise_view, promote_student_list_view

urlpatterns = []

# Promote Student
from .promote_student.views import get_student_list_session_class_wise_view, promote_student_list_view
urlpatterns += [
		url(r'^student_list_session_class_wise/', get_student_list_session_class_wise_view),
		url(r'^promote_student_list/', promote_student_list_view),
		]
