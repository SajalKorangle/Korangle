# greetings/urls.py
from django.conf.urls import url

from .views import ChangePasswordView, ProfileView

urlpatterns = []

urlpatterns += [

	url(r'^change-password', ChangePasswordView.as_view()),
	url(r'^update-profile', ProfileView.as_view()),

]

from .views import UserView, UserListView

urlpatterns += [
	url(r'^users/batch', UserListView.as_view()),
	url(r'^users', UserView.as_view()),
]
