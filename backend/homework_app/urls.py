from django.conf.urls import url

urlpatterns = []

from .views import HomeworkView,HomeworkListView

from .views import HomeworkQuestionView,HomeworkQuestionListView

urlpatterns += [
    url(r'^homework-question/batch', HomeworkQuestionListView.as_view()),
    url(r'^homework-question', HomeworkQuestionView.as_view()),
]

from .views import HomeworkStatusView,HomeworkStatusListView

urlpatterns += [
    url(r'^homework-status/batch', HomeworkStatusListView.as_view()),
    url(r'^homework-status', HomeworkStatusView.as_view()),
]

from .views import HomeworkAnswerView,HomeworkAnswerListView

urlpatterns += [
    url(r'^homework-answer/batch', HomeworkAnswerListView.as_view()),
    url(r'^homework-answer', HomeworkAnswerView.as_view()),
]

from .views import HomeworkSettingsView, HomeworkSettingsListView

urlpatterns += [
    url(r'^homework-settings/batch', HomeworkSettingsListView.as_view()),
    url(r'^homework-settings', HomeworkSettingsView.as_view()),
]

urlpatterns += [
    url(r'^homework/batch', HomeworkListView.as_view()),
    url(r'^homework', HomeworkView.as_view()),
]