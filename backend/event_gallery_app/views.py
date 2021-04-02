from django.shortcuts import render

# Create your views here.
from event_gallery_app.models import Event, EventImage, EventTag, EventImageTags, EventNotifyClass
from common.common_views_3 import CommonView, CommonListView
from rest_framework.views import APIView


# EVENTS #

class EventView(CommonView, APIView):
    Model = Event


class EventListView(CommonListView, APIView):
    Model = Event


# EVENT IMAGES #

class EventImageView(CommonView, APIView):
    Model = EventImage


class EventImageListView(CommonListView, APIView):
    Model = EventImage


# EVENT TAGS #

class EventTagView(CommonView, APIView):
    Model = EventTag


class EventTagListView(CommonListView, APIView):
    Model = EventTag


# EVENT IMAGE_TAGS #

class EventImageTagView(CommonView, APIView):
    Model = EventImageTags


class EventImageTagListView(CommonListView, APIView):
    Model = EventImageTags


# EVENT NOTIFY CLASS #

class EventNotifyClassView(CommonView, APIView):
    Model = EventNotifyClass


class EventNotifyClassListView(CommonListView, APIView):
    Model = EventNotifyClass
