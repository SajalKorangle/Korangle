# greetings/urls.py
from django.conf.urls import url

from .views import new_fee_receipt_view, new_concession_view, concession_list_view

from .fees import fee_list_view

from .marksheet import get_student_marksheet, update_student_marksheet, delete_student_marksheet

from .user import LoginUserView, UserDetailsView

urlpatterns = [

    url(r'^new_fee_receipt/', new_fee_receipt_view),
    url(r'^fee_list/', fee_list_view),

    url(r'^new_concession/', new_concession_view),
    url(r'^concession_list/', concession_list_view),

	url(r'^get_student_marksheet/', get_student_marksheet),
	url(r'^update_student_marksheet/', update_student_marksheet),
	url(r'^delete_student_marksheet/', delete_student_marksheet),

	url(r'^get-user-details/', UserDetailsView.as_view(), name="user_details"),
	url(r'^login-user-details/', LoginUserView.as_view(), name="login_user_details"),

]
