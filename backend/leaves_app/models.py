from django.db import models
from school_app.model.models import School
from django.contrib.auth import get_user_model
from common.common import BasePermission

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

    # User
    parentUser = models.ForeignKey(
        User, on_delete=models.PROTECT, default=0, verbose_name='parentUser')

    # School
    parentSchool = models.ForeignKey(
        School, on_delete=models.PROTECT, null=True, verbose_name='parentSchool')

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']

    class Meta:
        db_table = 'leaves'
