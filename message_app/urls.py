from django.conf.urls import url

from .views import indices_view, questions_view, create_database, read_file_test, update_database

urlpatterns = [
	url(r'^indices/', indices_view),
	url(r'^questions/', questions_view),
	url(r'^createdatabase/', create_database),
	url(r'^readfile/', read_file_test),
	url(r'^updatedatabase/', update_database),
]
