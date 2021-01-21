from django.conf.urls import url

urlpatterns = []

from .views import EventListView, EventView

urlpatterns += [
    url(r'^event/batch', EventListView.as_view()),
    url(r'^event', EventView.as_view()),
]

from .views import EventImageView, EventImageListView

urlpatterns += [
    url(r'^event-image/batch', EventImageView.as_view()),
    url(r'^event-image', EventImageListView.as_view()),
]

from .views import EventTagListView, EventTagView

urlpatterns += [
    url(r'^event-tag/batch', EventTagListView.as_view()),
    url(r'^event-tag', EventTagView.as_view()),
]
