from django.db import models


from school_app.model.models import Board
from common.common import BasePermission
from feature_flag_app.models import FeatureFlag

# Create your models here.


class ModuleManager(models.Manager):

    def get_queryset(self):
        return super().get_queryset().exclude(parentFeatureFlag__enabled=False)


class Module(models.Model):

    path = models.TextField(default='', null=False, unique=True, verbose_name='path')
    title = models.TextField(default='', null=False, verbose_name='title')
    icon = models.TextField(default='', null=False, verbose_name='icon')
    orderNumber = models.IntegerField(default=1, null=False)
    parentBoard = models.ForeignKey(Board, on_delete=models.PROTECT, null=True, verbose_name='parentBoard')

    parentFeatureFlag = models.ForeignKey(FeatureFlag, on_delete=models.SET_NULL, null=True, verbose_name='parentFeatureFlag')

    objects = ModuleManager()

    def __str__(self):
        return str(self.title)

    class Meta:
        db_table = 'module'

    class Permissions(BasePermission):
        RelationsToSchool = []
        RelationsToStudent = []


class TaskManager(models.Manager):

    def get_queryset(self):
        return super().get_queryset()\
            .exclude(parentModule__parentFeatureFlag__enabled=False)\
            .exclude(parentFeatureFlag__enabled=False)


class Task(models.Model):

    parentModule = models.ForeignKey(Module, on_delete=models.PROTECT, null=False, verbose_name='parentModule', default=0)
    path = models.TextField(default='', null=False, verbose_name='path')
    title = models.TextField(default='', null=False, verbose_name='title')
    orderNumber = models.IntegerField(default=1, null=False)
    parentBoard = models.ForeignKey(Board, on_delete=models.PROTECT, null=True, blank=True, verbose_name='parentBoard')
    videoUrl = models.TextField(null=True, verbose_name='videoUrl', blank=True)

    parentFeatureFlag = models.ForeignKey(FeatureFlag, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='parentFeatureFlag')

    # If True, then the page will be blocked when school account is suspended.
    blockWhenSuspended = models.BooleanField(default=False)

    objects = TaskManager()

    def __str__(self):
        return str(self.parentModule.title) + ' -- ' + str(self.title)

    class Meta:
        db_table = 'task'
        unique_together = ('parentModule', 'path')

    class Permissions(BasePermission):
        RelationsToSchool = []
        RelationsToStudent = []
