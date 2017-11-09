# greetings/urls.py
from django.conf.urls import url

from .views import student_data_view, class_student_list_view, class_list_view, new_student_data_view, new_fee_receipt_view, fee_list_view, update_student_view, authentication_view, login_data_view, logout_view


urlpatterns = [
    url(r'^student_data/', student_data_view),
    url(r'^class_student_list/', class_student_list_view),
    url(r'^class_list/', class_list_view),
    url(r'^new_student/', new_student_data_view),
    url(r'^new_fee_receipt/', new_fee_receipt_view),
    url(r'^fee_list/', fee_list_view),
    url(r'^update_student/', update_student_view),
    url(r'^authentication/', authentication_view),
    url(r'^login/', login_data_view),
    url(r'^logout/', logout_view),
		]
