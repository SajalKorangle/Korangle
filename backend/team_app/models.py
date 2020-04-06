from django.db import models


from school_app.model.models import Board

# Create your models here.


class Module(models.Model):

    path = models.TextField(default='', null=False, unique=True, verbose_name='path')
    title = models.TextField(default='', null=False, verbose_name='title')
    icon = models.TextField(default='', null=False, verbose_name='icon')
    orderNumber = models.IntegerField(default=1, null=False)
    parentBoard = models.ForeignKey(Board, on_delete=models.PROTECT, null=True, verbose_name='parentBoard')

    def __str__(self):
        return str(self.title)

    class Meta:
        db_table = 'module'


class Task(models.Model):

    parentModule = models.ForeignKey(Module, on_delete=models.PROTECT, null=False, verbose_name='parentModule', default=0)
    path = models.TextField(default='', null=False, verbose_name='path')
    title = models.TextField(default='', null=False, verbose_name='title')
    orderNumber = models.IntegerField(default=1, null=False)
    parentBoard = models.ForeignKey(Board, on_delete=models.PROTECT, null=True, verbose_name='parentBoard')

    def __str__(self):
        return str(self.parentModule.title) + ' -- ' + str(self.title)

    class Meta:
        db_table = 'task'
        unique_together = ('parentModule', 'path')

