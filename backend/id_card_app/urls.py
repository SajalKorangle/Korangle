from django.conf.urls import url

urlpatterns = []

from id_card_app.views import IdCardLayoutView, IdCardLayoutListView

urlpatterns += [

    url(r'^id-card-layout/batch', IdCardLayoutListView.as_view()),
    url(r'^id-card-layout', IdCardLayoutView.as_view()),

]