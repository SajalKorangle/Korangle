from django.db import models
from django.db.models.fields import related
from common.common import BasePermission

from team_app.models import Task
from employee_app.models import Employee


class ActivityRecord(models.Model):

    parentTask = models.ForeignKey(Task, on_delete=models.SET_NULL, null = True)
    parentEmployee = models.ForeignKey(Employee, on_delete=models.SET_NULL, null = True, verbose_name='parentEmployee')
    activityDescription = models.TextField()
    createdAt = models.DateTimeField(auto_now_add = True)

    def __str__(self):
        return str(self.parentTask.title) + ' -- ' + str(self.parentEmployee.name)

    class Permissions(BasePermission):
        RelationsToSchool = ['parentEmployee__parentSchool__id']

    class Meta:
        db_table = 'activity_record'
