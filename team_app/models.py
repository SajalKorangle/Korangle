from django.db import models
from django.contrib.auth.models import User


from school_app.model.models import School

# Create your models here.


class Module(models.Model):

    path = models.TextField(default='', null=False, unique=True, verbose_name='path')
    title = models.TextField(default='', null=False, verbose_name='title')
    icon = models.TextField(default='', null=False, verbose_name='icon')
    orderNumber = models.IntegerField(default=1, null=False)

    def __str__(self):
        return str(self.title)

    class Meta:
        db_table = 'module'


class Task(models.Model):

    parentModule = models.ForeignKey(Module, on_delete=models.PROTECT, null=False, verbose_name='parentModule', default=0)
    path = models.TextField(default='', null=False, verbose_name='path')
    title = models.TextField(default='', null=False, verbose_name='title')
    orderNumber = models.IntegerField(default=1, null=False)

    def __str__(self):
        return str(self.parentModule.title) + ' -- ' + str(self.title)

    class Meta:
        db_table = 'task'
        unique_together = ('parentModule', 'path')


class Access(models.Model):

    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, null=False, verbose_name='parentSchool', default=0)
    parentModule = models.ForeignKey(Module, on_delete=models.PROTECT, null=False, verbose_name='parentModule', default=0)

    def __str__(self):
        return self.parentSchool.name + ' -- ' + self.parentModule.title

    class Meta:
        db_table = 'access'
        unique_together = ('parentSchool', 'parentModule')


'''class Permission(models.Model):

    parentTask = models.ForeignKey(Task, on_delete=models.PROTECT, null=False, verbose_name='parentTask', default=0)
    parentUser = models.ForeignKey(User, on_delete=models.PROTECT, null=False, verbose_name='parentUser', default=0)
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, null=False, verbose_name='parentSchool', default=0)

    def __str__(self):
        return self.parentUser.username + ' -- ' + str(self.parentTask)

    class Meta:
        db_table = 'permission'
        unique_together = ('parentUser', 'parentTask', 'parentSchool')


class Member(models.Model):

    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, null=False, verbose_name='parentSchool', default=0)
    parentUser = models.ForeignKey(User, on_delete=models.PROTECT, null=False, verbose_name='parentUser', default=0)

    def __str__(self):
        return self.parentSchool.name + ' -- ' + self.parentUser.username

    class Meta:
        db_table = 'member'
        unique_together = ('parentUser', 'parentSchool')'''

