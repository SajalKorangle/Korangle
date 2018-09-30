from django.conf.urls import url

from .views import ModuleView, UserView

urlpatterns = []

######## User ###############

urlpatterns += [
	url(r'^users', UserView.as_view()),
]


######## Module ###############

urlpatterns += [
	url(r'^school/(?P<school_id>[0-9]+)/modules', ModuleView.as_view()),
]
