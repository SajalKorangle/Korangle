from django.db import models

from examination_app.models import Examination
from school_app.model.models import BusStop, Session, School
from student_app.models import Student

from django.contrib.auth.models import User

class Grade(models.Model):
    name = models.TextField(verbose_name='name')
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE, default=0,verbose_name='parentSchool')

    class Meta:
        db_table = 'grades'
        unique_together = ('name','parentSchool')

class SubGrade(models.Model):
    parentGrade = models.ForeignKey(Grade,on_delete=models.CASCADE,default=0,verbose_name='parentGrade')
    name = models.TextField(verbose_name='name')

    class Meta:
        db_table = 'sub_grade'
        unique_together = ('name', 'parentGrade')

class StudentSubGrade(models.Model):

    gradeObtained = models.TextField(verbose_name='gradeObtained')
    parentSubGrade = models.ForeignKey(SubGrade,on_delete=models.CASCADE,null=False,default=0, verbose_name='parentSubGrade')
    parentStudent = models.ForeignKey(Student,on_delete=models.CASCADE,null=False,default=0, verbose_name='parentStudent')
    parentExamination = models.ForeignKey(Examination, on_delete=models.CASCADE,null=False, default=0, verbose_name='parentExamination')

    class Meta:
        db_table = 'student_sub_grade'
        unique_together = ('parentSubGrade', 'parentStudent', 'parentExamination')