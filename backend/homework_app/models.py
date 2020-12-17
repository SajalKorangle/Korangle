from django.db import models

# Create your models here.

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


class Homework(models.Model):

    homeworkName = models.TextField(null=False)
    parentClassSubject = models.ForeignKey(ClassSubject, on_delete=models.CASCADE, null=False, default=0, verbose_name='parentClassSubject')
    startDate = models.DateField(null=False, verbose_name='startDate')
    endDate = models.DateField(null=True, verbose_name='endDate')
    startTime = models.TimeField(null=False, verbose_name='startTime')
    endTime = models.TimeField(null=True, blank=True, verbose_name='endTime', default='23:59:59')
    homeworkText = models.TextField(null=True)
    

    class Meta:
        db_table = 'homework'

class HomeworkQuestion(models.Model):

    parentHomework = models.ForeignKey(Homework, on_delete= models.CASCADE, null=False, default=0, verbose_name='parentHomework')
    questionImage = models.ImageField('question_image', upload_to = upload_question_to,blank = True,null=True)
    orderNumber = models.IntegerField(null=False, default=0, verbose_name='orderNumber')

    class Meta:
        db_table = 'homework_question'

class HomeworkStatus(models.Model):

    parentStudent = models.ForeignKey(Student, on_delete=models.CASCADE, null=False, default=0, verbose_name='parentStudent')
    parentHomework = models.ForeignKey(Homework, on_delete= models.CASCADE, null=False, default=0, verbose_name='parentHomework')
    
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
    answerText = models.TextField(null=True)
    remark = models.TextField(null=True, blank=True, verbose_name='remark')
    
    class Meta:
        db_table = 'homework_status'
        unique_together = ('parentStudent', 'parentHomework')

class HomeworkAnswer(models.Model):

    parentHomework = models.ForeignKey(Homework, on_delete= models.CASCADE, null=False, default=0, verbose_name='parentHomework')
    parentStudent = models.ForeignKey(Student, on_delete=models.CASCADE, null=False, default=0, verbose_name='parentStudent')

    answerImage = models.ImageField("answer_image", upload_to = upload_answer_to,blank = True,null=True)
    orderNumber = models.IntegerField(null=False, default=0, verbose_name='orderNumber')

    class Meta:
        db_table = 'homework_answer'

class HomeworkSettings(models.Model):
    
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0, verbose_name='parentSchool')

    SMS_UPDATE = 'SMS'
    NOTIFICATION_UPDATE = 'NOTIFICATION'
    NOTIFSMS_UPDATE = 'NOTIF./SMS'
    NO_UPDATE = 'NULL'
    SENTUPDATE_CHOICES = [
        (SMS_UPDATE, 'SMS'),
        (NOTIFICATION_UPDATE, 'NOTIFICATION'),
        (NOTIFSMS_UPDATE, 'NOTIF./SMS'),
        (NO_UPDATE, 'NULL')
    ]

    sentUpdateType = models.CharField(max_length=20, choices=SENTUPDATE_CHOICES, null=False, default=NOTIFICATION_UPDATE, verbose_name='sentUpdateType')

    sendCreateUpdate = models.BooleanField(null=False, default=True, verbose_name='sendCreateUpdate')
    sendEditUpdate = models.BooleanField(null=False, default=True, verbose_name='sendEditUpdate')
    sendDeleteUpdate = models.BooleanField(null=False, default=True, verbose_name='sendDeleteUpdate')

    class Meta:
        db_table = 'homework_settings'