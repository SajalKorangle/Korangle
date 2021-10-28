from django.conf.urls import url

urlpatterns = []

from .views import HomeworkQuestionView,HomeworkQuestionListView

from .views import HomeworkQuestionImageView,HomeworkQuestionImageListView

urlpatterns += [
    url(r'^homework-question-image/batch', HomeworkQuestionImageListView.as_view()),
    url(r'^homework-question-image', HomeworkQuestionImageView.as_view()),
]

from .views import HomeworkAnswerImageView,HomeworkAnswerImageListView

urlpatterns += [
    url(r'^homework-answer-image/batch', HomeworkAnswerImageListView.as_view()),
    url(r'^homework-answer-image', HomeworkAnswerImageView.as_view()),
]

from .views import HomeworkAnswerView,HomeworkAnswerListView

urlpatterns += [
    url(r'^homework-answer/batch', HomeworkAnswerListView.as_view()),
    url(r'^homework-answer', HomeworkAnswerView.as_view()),
]


urlpatterns += [
    url(r'^homework-question/batch', HomeworkQuestionListView.as_view()),
    url(r'^homework-question', HomeworkQuestionView.as_view()),
]