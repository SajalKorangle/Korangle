from common.common_views import CommonView, CommonListView, APIView

from homework_app.models import Homework, HomeworkQuestion, HomeworkStatus, HomeworkAnswer
# Create your views here.

####### HOMEWORK #########

class HomeworkView(CommonView, APIView):
    Model = Homework

class HomeworkListView(CommonListView, APIView):
    Model = Homework

####### HOMEWORK QUESTION #########

class HomeworkQuestionView(CommonView, APIView):
    Model = HomeworkQuestion

class HomeworkQuestionListView(CommonListView, APIView):
    Model = HomeworkQuestion

####### HOMEWORK STATUS #########

class HomeworkStatusView(CommonView, APIView):
    Model = HomeworkStatus

class HomeworkStatusListView(CommonListView, APIView):
    Model = HomeworkStatus

####### HOMEWORK ANSWER #########

class HomeworkAnswerView(CommonView, APIView):
    Model = HomeworkAnswer

class HomeworkAnswerListView(CommonListView, APIView):
    Model = HomeworkAnswer
