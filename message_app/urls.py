from django.conf.urls import url

from rest_framework_jwt.views import obtain_jwt_token, verify_jwt_token

from .views import indices_view, questions_view, create_database, read_file_test, update_database, HelloWorldView, hello_world, print_user_name_view

urlpatterns = [
	url(r'^indices/', indices_view),
	url(r'^questions/', questions_view),
	url(r'^createdatabase/', create_database),
	url(r'^readfile/', read_file_test),
	url(r'^updatedatabase/', update_database),
	url(r'^hello/', HelloWorldView.as_view(), name="hello_world"),
	url(r'^hellofunction/', hello_world),
	url(r'^jwt-auth/', obtain_jwt_token),
	url(r'^printusername/', print_user_name_view),
	url(r'^verify-jwt-token/', verify_jwt_token),
]
