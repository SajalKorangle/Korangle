from .views import BookRemoveImage

from django.conf.urls import url

urlpatterns = []

urlpatterns += [
    url(r'^book-remove-image', BookRemoveImage.as_view()),
]