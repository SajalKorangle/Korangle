from django.conf.urls import url

from .views import ModuleView, UserView, ModuleListView

urlpatterns = []

######## User ###############

urlpatterns += [
	url(r'^users', UserView.as_view()),
]


######## Module ###############

urlpatterns += [
	url(r'^school/(?P<school_id>[0-9]+)/modules', ModuleView.as_view()),
	url(r'^modules', ModuleListView.as_view()),
]

######## Access ###############
from .views import AccessListView

urlpatterns += [
	url(r'^access/batch', AccessListView.as_view()),
]

######## Task ###############
from .views import TaskListView

urlpatterns += [
	url(r'^tasks', TaskListView.as_view()),
]
