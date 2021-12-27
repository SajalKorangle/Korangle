from django.db import models

from team_app.models import Task
from employee_app.models import Employee


class ActivityRecord(models.Model):

    parentTask = models.ForeignKey(Task, on_delete=models.SET_NULL, null = True)
    parentEmployee = models.ForeignKey(Employee, on_delete=models.SET_NULL, null = True)
    activityDescription = models.TextField()
    createdAt = models.DateTimeField(auto_now_add = True)

    def __str__(self):
        return str(self.parentTask.title) + ' -- ' + str(self.parentEmployee.name)

    class Meta:
        db_table = 'activity_record'
