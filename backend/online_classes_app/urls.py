
from django.conf.urls import url

urlpatterns = []


from online_classes_app import views

urlpatterns += [
    url(r'^online-class/batch', views.OnlineClassListView.as_view()),
    url(r'^online-class', views.OnlineClassView.as_view()),
]



