from django.db import models

# Create your models here.

from subject_app.models import ClassSubject
from student_app.models import Student


class Homework(models.Model):

    homeworkName = models.TextField(null=False)
    parentClassSubject = models.ForeignKey(ClassSubject, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentClassSubject')
    startDate = models.DateField(null=False, verbose_name='startDate', default='2011-01-01')
    endDate = models.DateField(null=False, verbose_name='endDate', default='2011-01-01')
    homeworkText = models.TextField(null=True)
    

    class Meta:
        db_table = 'homework'

class HomeworkQuestion(models.Model):

    parentHomework = models.ForeignKey(Homework, on_delete= models.PROTECT, null=False, default=0, verbose_name='parentHomework')
    questionImage = models.ImageField(null=True)

    class Meta:
        db_table = 'homework_question'

class HomeworkStatus(models.Model):

    parentStudent = models.ForeignKey(Student, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentStudent')
    parentHomework = models.ForeignKey(Homework, on_delete= models.PROTECT, null=False, default=0, verbose_name='parentHomework')
    
    HOMEWORK_GIVEN_STATUS = 'GIVEN'
    HOMEWORK_SUBMITTED_STATUS = 'SUBMITTED'
    HOMEWORK_CHECKED_STATUS = 'CHECKED'
    HOMEWORK_RESUBMISSION_STATUS = 'ASKED FOR RESUBMISSION'

    HOMEWORK_STATUS = (
        (HOMEWORK_GIVEN_STATUS, 'GIVEN'),
        (HOMEWORK_SUBMITTED_STATUS, 'SUBMITTED'),
        (HOMEWORK_CHECKED_STATUS, 'CHECKED'),
        (HOMEWORK_RESUBMISSION_STATUS, 'ASKED FOR RESUBMISSION'),
    )

    homeworkStatus = models.TextField(null=False, choices=HOMEWORK_STATUS, default=HOMEWORK_GIVEN_STATUS)
    submissionDate = models.DateField(null=False, verbose_name='submissionDate', default='2011-01-01')

    answerText = models.TextField(null=True)
    
    class Meta:
        db_table = 'homework_status'
        unique_together = ('parentStudent', 'parentHomework')

class HomeworkAnswer(models.Model):

    parentHomework = models.ForeignKey(Homework, on_delete= models.PROTECT, null=False, default=0, verbose_name='parentHomework')
    answerImage = models.ImageField(null=True)

    class Meta:
        db_table = 'homework_answer'