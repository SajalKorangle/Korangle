from django.db import models
from school_app.model.models import School
from django.contrib.auth import get_user_model
from common.common import BasePermission
from django.contrib.postgres.fields import ArrayField

User = get_user_model()

# Create your models here.


class EmployeeLeaveTypes(models.Model):

    # Leave Type Title
    # if name is invalid_type then it will not be considered
    leaveTypeName = models.TextField(
        null=False, verbose_name='leave_name', default='invalid_type')

    # Leave Paid Status
    # type 0 - Paid
    # type 1 - Non Paid
    leaveType = models.IntegerField(null=False, default=0)

    # School
    parentSchool = models.ForeignKey(
        School, on_delete=models.PROTECT, null=True, verbose_name='parentSchool')

    # Color Code for this Type
    color = models.TextField(
        null=False, verbose_name='color', default='#ffffff')

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']

    class Meta:
        db_table = 'employee_leave_type'
