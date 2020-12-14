
from common.common_views_3 import CommonListView, CommonView, APIView

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


