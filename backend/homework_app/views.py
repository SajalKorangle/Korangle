from common.common_views_file import CommonView, CommonListView
from rest_framework.views import APIView

from homework_app.models import HomeworkQuestion,HomeworkQuestionImage,HomeworkAnswer, HomeworkAnswerImage
# Create your views here.

####### HOMEWORK #########

class HomeworkQuestionView(CommonView, APIView):
    Model = HomeworkQuestion

class HomeworkQuestionListView(CommonListView, APIView):
    Model = HomeworkQuestion

####### HOMEWORK QUESTION #########

class HomeworkQuestionImageView(CommonView, APIView):
    Model = HomeworkQuestionImage

class HomeworkQuestionImageListView(CommonListView, APIView):
    Model = HomeworkQuestionImage

####### HOMEWORK STATUS #########

class HomeworkAnswerView(CommonView, APIView):
    Model = HomeworkAnswer

class HomeworkAnswerListView(CommonListView, APIView):
    Model = HomeworkAnswer

####### HOMEWORK ANSWER #########

class HomeworkAnswerImageView(CommonView, APIView):
    Model = HomeworkAnswerImage

class HomeworkAnswerImageListView(CommonListView, APIView):
    Model = HomeworkAnswerImage





