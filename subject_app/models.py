from django.db import models

from school_app.model.models import School, Session
from class_app.models import Class, Division
from student_app.models import Student

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

    class Meta:
        db_table = 'subject_second'
        ordering = ['name']


class ClassSubject(models.Model):

    parentSubject = models.ForeignKey(SubjectSecond, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentSubject')
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentSchool')
    parentClass = models.ForeignKey(Class, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentClass')
    parentDivision = models.ForeignKey(Division, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentDivision')
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentSession')

    class Meta:
        db_table = 'class_subject'
        unique_together = ('parentClass', 'parentDivision', 'parentSchool', 'parentSubject', 'parentSession')


class StudentSubject(models.Model):

    parentSubject = models.ForeignKey(SubjectSecond, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentSubject')
    parentStudent = models.ForeignKey(Student, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentStudent')
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentSession')

    class Meta:
        db_table = 'student_subject'
        unique_together = ('parentSubject', 'parentStudent', 'parentSession')
