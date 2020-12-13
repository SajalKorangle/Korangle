
from rest_framework.views import APIView

from common.common_views_3 import CommonListView, CommonView

from team_app.models import Module, Task

########### Module #############


class ModuleView(CommonView, APIView):
    Model = Module


class ModuleListView(CommonListView, APIView):
    Model = Module


########### Task #############


class TaskView(CommonView, APIView):
    Model = Task


class TaskListView(CommonListView, APIView):
    Model = Task


