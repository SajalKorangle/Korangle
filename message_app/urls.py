from django.conf.urls import url

from rest_framework_jwt.views import obtain_jwt_token, verify_jwt_token

from .views import indices_view, questions_view, LoginUserView, UserDetailsView, NewUserView, save_paper, get_paper_list, get_paper, delete_paper, print_booklet

urlpatterns = [
	url(r'^indices/', indices_view),
	url(r'^questions/', questions_view),
	url(r'^jwt-auth/', obtain_jwt_token),
	url(r'^get-user-details/', UserDetailsView.as_view(), name="user_details"),
	url(r'^login-user-details/', LoginUserView.as_view(), name="login_user_details"),
	url(r'^new-user/', NewUserView.as_view(), name="new_user"),
	url(r'^save-paper/', save_paper),
	url(r'^get-paper-list/', get_paper_list),
	url(r'^get-paper/', get_paper),
	url(r'^delete-paper/', delete_paper),
	url(r'^print-booklet/', print_booklet),
]
