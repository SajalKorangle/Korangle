from django.db import models

from school_app.model.models import BusStop, Session, School
from student_app.models import Student

from django.contrib.auth.models import User

class Grade(models.Model):
    name = models.CharField(max_length=100)
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE, default=0)
    parentSession = models.ForeignKey(Session, on_delete=models.CASCADE, null=False, default=0,verbose_name='parentSession')

    class Meta:
        db_table = 'grades'

class SubGrade(models.Model):
    parentGrade = models.ForeignKey(Grade,on_delete=models.CASCADE,default=0)
    name = models.CharField(max_length=100)

    class Meta:
        db_table = 'sub_grade'

class StudentSubGrade(models.Model):

    GRADES = (
        ('A', 'A'),
        ('B', 'B'),
        ('C', 'C'),
        ('D', 'D'),
        ('E', 'E'),
    )
    gradeObtained = models.CharField(max_length=1, choices=GRADES, null=False, default='A')
    parentSubGrade = models.ForeignKey(SubGrade,on_delete=models.CASCADE,null=False,default=0, verbose_name='parentSubGrade')
    parentStudent = models.ForeignKey(Student,on_delete=models.CASCADE,null=False,default=0, verbose_name='parentStudent')

    class Meta:
        db_table = 'student_sub_grade'