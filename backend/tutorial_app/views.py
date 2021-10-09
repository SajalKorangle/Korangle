from django.shortcuts import render
from common.common_views import CommonView, CommonListView, APIView


# Create your views here.
from .models import Tutorial


class TutorialView(CommonView, APIView):
    Model = Tutorial


class TutorialListView(CommonListView, APIView):
    Model = Tutorial
