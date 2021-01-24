from django.conf.urls import url

urlpatterns = []

from tutorial_app.views import TutorialSettingsView, TutorialSettingsListView

urlpatterns += [
    url(r'^tutorial-settings/batch', TutorialSettingsListView.as_view()),
    url(r'^tutorial-settings', TutorialSettingsView.as_view()),
]

from tutorial_app.views import TutorialView, TutorialListView

urlpatterns += [
    url(r'^tutorial/batch', TutorialListView.as_view()),
    url(r'^tutorial', TutorialView.as_view()),
]
