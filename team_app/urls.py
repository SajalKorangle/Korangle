from django.conf.urls import url

urlpatterns = []


from team_app.views import ModuleView, ModuleListView

urlpatterns += [
    url(r'^module/batch', ModuleListView.as_view()),
    url(r'^module', ModuleView.as_view()),
]


from team_app.views import TaskListView, TaskView

urlpatterns += [
    url(r'^task/batch', TaskListView.as_view()),
    url(r'^task', TaskView.as_view()),
]


