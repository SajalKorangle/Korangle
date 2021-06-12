from django.conf.urls import url

from .views import SettelmentsCycleListView

urlpatterns = [
    url(r'^settelment-cycle', SettelmentsCycleListView.as_view()),
]