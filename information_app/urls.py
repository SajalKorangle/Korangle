from django.conf.urls import url

urlpatterns = []

from .views import MessageTypeView, MessageTypeListView
urlpatterns += [
	url(r'^message-type/batch', MessageTypeListView.as_view()),
	url(r'^message-type', MessageTypeView.as_view()),
]