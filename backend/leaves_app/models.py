from django.db import models
from school_app.model.models import School
from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import CITextField
from common.common import BasePermission
User = get_user_model()

# Create your models here.


class SchoolLeaveType(models.Model):

    # Leave Type Title
    # if name is invalid_type then it will not be considered
    leaveTypeName = CITextField(
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
    
    # JSON encoded map of month name mapped to list of 2 data items
    # string -> list
    # list description  : [number of leaves permitted, leaves type]
    # number of leaves  : number (Number of leaves permitted in this month)
    # leaves type       : CFW, Lapse, ENC (will these be accumulated or not)
    assignedLeavesMonthWise = models.TextField(
        null=False, verbose_name='Leaves Vs Month', default='{}')
    
    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']

    class Meta:
        db_table = 'school_leave_type'
        unique_together = (("leaveTypeName", "parentSchool", ), ("color", "parentSchool"))
