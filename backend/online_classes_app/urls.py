
from django.conf.urls import url

urlpatterns = []


from online_classes_app.views import ActiveClassView, ActiveClassListView

urlpatterns += [
    url(r'^active-class/batch', ActiveClassListView.as_view()),
    url(r'^active-class', ActiveClassView.as_view()),
]



