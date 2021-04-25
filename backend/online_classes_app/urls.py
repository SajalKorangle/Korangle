
from django.conf.urls import url

urlpatterns = []


from online_classes_app import views

urlpatterns += [
    url(r'^online-class/batch', views.OnlineClassListView.as_view()),
    url(r'^online-class', views.OnlineClassView.as_view()),
    url(r'^zoom-metting-signature', views.ZoomMettingSignature.as_view()),
]



