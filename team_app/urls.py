from django.conf.urls import url

from .views import MemberView, ModuleView, PermissionView, UserView

urlpatterns = []

######## User ###############

urlpatterns += [
	url(r'^users', UserView.as_view()),
]


######## Permission ###############

urlpatterns += [
	url(r'^school/(?P<school_id>[0-9]+)/user/(?P<user_id>.+)/permissions', PermissionView.as_view()),
]


######## Module ###############

urlpatterns += [
	url(r'^school/(?P<school_id>[0-9]+)/modules', ModuleView.as_view()),
]


######## Member ###############

urlpatterns += [
	url(r'^school/(?P<school_id>[0-9]+)/members', MemberView.as_view()),
	url(r'^members/(?P<member_id>[0-9]+)', MemberView.as_view()),
]
