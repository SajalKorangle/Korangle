from django.conf.urls import url

urlpatterns = []


from .views import EventTagListView, EventTagView

urlpatterns += [
    url(r'^event-tag/batch', EventTagListView.as_view()),
    url(r'^event-tag', EventTagView.as_view()),
]

from .views import EventImageTagListView, EventImageTagView

urlpatterns += [
    url(r'^event-image-tag/batch', EventImageTagListView.as_view()),
    url(r'^event-image-tag', EventImageTagView.as_view()),
]

from .views import EventImageView, EventImageListView

urlpatterns += [
    url(r'^event-image/batch', EventImageListView.as_view()),
    url(r'^event-image', EventImageView.as_view()),
]

from .views import EventNotifyClassListView, EventNotifyClassView

urlpatterns += [
    url(r'^event-notify-class/batch', EventNotifyClassListView.as_view()),
    url(r'^event-notify-class', EventNotifyClassView.as_view()),
]

from .views import EventListView, EventView

urlpatterns += [
    url(r'^event/batch', EventListView.as_view()),
    url(r'^event', EventView.as_view()),
]