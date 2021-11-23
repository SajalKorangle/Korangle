from django.conf.urls import url

from .views import ContactDetailsView

urlpatterns = [
    url(r'^create-contact-details', ContactDetailsView.as_view()),
]
