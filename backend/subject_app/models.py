from django.db import models

from school_app.model.models import School, Session
from employee_app.models import Employee
from class_app.models import Class, Division
from student_app.models import Student
from common.common import BasePermission

# Create your models here.


class Subject(models.Model):

    name = models.TextField(null=False, default='', verbose_name='name', unique=True)
    orderNumber = models.IntegerField(null=False, default=0, verbose_name='orderNumber')
    governmentSubject = models.BooleanField(null=False, default=True, verbose_name='governmentSubject')

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'subject'
        ordering = ['orderNumber']


class SubjectSecond(models.Model):

    name = models.TextField(null=False, default='-', verbose_name='name', unique=True)

    def __str__(self):
        return self.name

    class Permissions(BasePermission):
        RelationsToSchool = []
        RelationsToStudent = []

    class Meta:
        db_table = 'subject_second'
        ordering = ['name']


class ClassSubject(models.Model):

    parentSubject = models.ForeignKey(SubjectSecond, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentSubject')
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentSchool')
    parentEmployee = models.ForeignKey(Employee, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentEmployee')
    parentClass = models.ForeignKey(Class, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentClass')
    parentDivision = models.ForeignKey(Division, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentDivision')
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentSession')
    mainSubject = models.BooleanField(null=False, default=True, verbose_name='mainSubject')
    onlyGrade = models.BooleanField(null=False, default=False, verbose_name='onlyGrade')
    orderNumber = models.BigIntegerField(default=0, verbose_name='orderNumber')

    class Meta:
        db_table = 'class_subject'
        unique_together = ('parentClass', 'parentDivision', 'parentSchool', 'parentSubject', 'parentSession')


class StudentSubject(models.Model):

    parentSubject = models.ForeignKey(SubjectSecond, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentSubject')
    parentStudent = models.ForeignKey(Student, on_delete=models.CASCADE, null=False, default=0, verbose_name='parentStudent')
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentSession')

    class Permissions(BasePermission):
        RelationsToSchool = ['parentStudent__parentSchool__id']
        RelationsToStudent = ['parentStudent__id']

    class Meta:
        db_table = 'student_subject'
        unique_together = ('parentSubject', 'parentStudent', 'parentSession')


class ExtraField(models.Model):

    name = models.TextField(null=False, default='-', verbose_name='name')

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'extra_field'


class ExtraSubField(models.Model):

    parentExtraField = models.ForeignKey(ExtraField, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentExtraField')
    name = models.TextField(null=False, default='-', verbose_name='name')

    def __str__(self):
        return self.name + ' --- ' + self.parentExtraField.name

    class Meta:
        db_table = 'extra_sub_field'
        unique_together = ('name', 'parentExtraField')
