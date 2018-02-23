# greetings/urls.py
from django.conf.urls import url

from .views import student_data_view, class_student_list_view, class_list_view, new_student_data_view, new_fee_receipt_view, update_student_view, delete_student_view, new_expense_view, expense_list_view, new_concession_view, concession_list_view, student_data_class_list_view, get_session_class_list_view

from .fees import fee_list_view

from .marksheet import get_student_marksheet, update_student_marksheet, delete_student_marksheet

from .user import LoginUserView, UserDetailsView

urlpatterns = [

    url(r'^student_data/', student_data_view),
    url(r'^class_student_list/', class_student_list_view),
    url(r'^class_list/', class_list_view),

    url(r'^new_student/', new_student_data_view),

    url(r'^new_fee_receipt/', new_fee_receipt_view),
    url(r'^fee_list/', fee_list_view),

    url(r'^new_concession/', new_concession_view),
    url(r'^concession_list/', concession_list_view),

    url(r'^update_student/', update_student_view),
    url(r'^delete_student_view/', delete_student_view),
	url(r'^student_data_class_list/', student_data_class_list_view),

	url(r'^get_student_marksheet/', get_student_marksheet),
	url(r'^update_student_marksheet/', update_student_marksheet),
	url(r'^delete_student_marksheet/', delete_student_marksheet),

	url(r'^get-user-details/', UserDetailsView.as_view(), name="user_details"),
	url(r'^login-user-details/', LoginUserView.as_view(), name="login_user_details"),

	url(r'^session_class_list/', get_session_class_list_view),

    # url(r'^new_expense/', new_expense_view),
    # url(r'^expense_list/', expense_list_view),

    # url(r'^authentication/', authentication_view),
    # url(r'^login/', login_data_view),
    # url(r'^logout/', logout_view),

		]
