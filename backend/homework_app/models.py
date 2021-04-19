from django.db import models

# Create your models here.
from information_app.models import SentUpdateType
from sms_app.models import SMSEvent, SMSTemplate
from subject_app.models import ClassSubject
from student_app.models import Student
from school_app.model.models import School

import os
from django.utils.timezone import now
from datetime import datetime, date

def upload_question_to(instance, filename):
    filename_base, filename_ext = os.path.splitext(filename)
    return 'homeworks/%s/question_file/%s%s' % (instance.id, now().timestamp(), filename_ext.lower())

def upload_answer_to(instance, filename):
    filename_base, filename_ext = os.path.splitext(filename)
    return 'homeworks/%s/answer_file/%s%s' % (instance.id, now().timestamp(), filename_ext.lower())


class HomeworkQuestion(models.Model):

    homeworkName = models.TextField(null=False ,default='')
    parentClassSubject = models.ForeignKey(ClassSubject, on_delete=models.CASCADE, null=False, default=0, verbose_name='parentClassSubject')
    startDate = models.DateField(null=False, verbose_name='startDate')
    endDate = models.DateField(null=True, verbose_name='endDate')
    startTime = models.TimeField(null=False, verbose_name='startTime')
    endTime = models.TimeField(null=True, blank=True, verbose_name='endTime', default='23:59:59')
    homeworkText = models.TextField(null=True, blank=True)
    

    class Meta:
        db_table = 'homework_question'

class HomeworkQuestionImage(models.Model):

    parentHomeworkQuestion = models.ForeignKey(HomeworkQuestion, on_delete= models.CASCADE, null=False, default=0, verbose_name='parentHomeworkQuestion')
    questionImage = models.ImageField('question_image', upload_to = upload_question_to,blank = True,null=True)
    orderNumber = models.IntegerField(null=False, default=0, verbose_name='orderNumber')

    class Meta:
        db_table = 'homework_question_image'

class HomeworkAnswer(models.Model):

    parentStudent = models.ForeignKey(Student, on_delete=models.CASCADE, null=False, default=0, verbose_name='parentStudent')
    parentHomeworkQuestion = models.ForeignKey(HomeworkQuestion, on_delete= models.CASCADE, null=False, default=0, verbose_name='parentHomeworkQuestion')
    
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
    submissionDate = models.DateField(null=True, verbose_name='submissionDate')
    submissionTime = models.TimeField(null=True, verbose_name='submissionTime')
    answerText = models.TextField(null=True, blank=True)
    remark = models.TextField(null=True, blank=True, verbose_name='remark')
    
    class Meta:
        db_table = 'homework_answer'
        unique_together = ('parentStudent', 'parentHomeworkQuestion')

class HomeworkAnswerImage(models.Model):

    parentHomeworkAnswer = models.ForeignKey(HomeworkAnswer, on_delete=models.CASCADE, null=False, default=0, verbose_name='parentHomeworkAnswer')

    answerImage = models.ImageField("answer_image", upload_to = upload_answer_to,blank = True,null=True)
    orderNumber = models.IntegerField(null=False, default=0, verbose_name='orderNumber')

    class Meta:
        db_table = 'homework_answer_image'
