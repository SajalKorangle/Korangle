from django.shortcuts import render

# Create your views here.
from event_gallery_app.models import Event, EventImage, EventTag
from common.common_views_file import CommonView, CommonListView
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
