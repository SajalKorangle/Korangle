from django.db import models
from school_app.model.models import School
from django.contrib.auth import get_user_model
from common.common import BasePermission
from django.contrib.postgres.fields import ArrayField

User = get_user_model()

# Create your models here.


class LeaveTypes(models.Model):

    # Leave Type Title
    # if name is invalid_type then it will not be considered
    name = models.TextField(
        null=False, verbose_name='leave_name', default='invalid_type')

    # Leave Paid Status
    # type 0 - Paid
    # type 1 - Non Paid
    leave_type = models.IntegerField(null=False, default=0)

    # School
    parent_school = models.ForeignKey(
        School, on_delete=models.PROTECT, null=True, verbose_name='parentSchool')

    # Color Code for this Type
    color = models.TextField(
        null=False, verbose_name='color', default='#ffffff')

    # JSON encoded map of month name mapped to list of 2 data items
    # string -> list
    # list description  : [number of leaves permitted, leaves type]
    # number of leaves  : number (Number of leaves permitted in this month)
    # leaves type       : CFW, Lapse, ENC (will these be accumulated or not)
    assigned_leaves_monthWise = models.TextField(
        null=False, verbose_name='Leaves Vs Month', default='{}')

    # Active Salary Components (!0 - active, 0 - inactive)
    # array is as follows - [Base Salary, HRA, DA]
    # if any component is greater than 0 then it is additive
    # else if it is less than 0 it is deductive
    # and equal to zero means it is inactive
    salary_components = ArrayField(
        models.IntegerField(null=False, default=0), size=3, null=False, default=[0, 0, 0])

    # division Factor
    division_factor = models.IntegerField(null = False, default = 1)

    # division Factor type
    # 0 -> Total Number of days in month
    division_factor_type = models.IntegerField(null = False, default = 0)
    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']

    class Meta:
        db_table = 'leaves'
