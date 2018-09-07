# greetings/urls.py
from django.conf.urls import url

from .views import ChangePasswordView, ProfileView

urlpatterns = [

	url(r'^change-password', ChangePasswordView.as_view()),
	url(r'^update-profile', ProfileView.as_view()),

]
