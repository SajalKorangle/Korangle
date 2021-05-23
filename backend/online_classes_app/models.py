from django.db import models
from django.db.models.base import Model

# Create your models here.
from school_app.model.models import School
from class_app.models import Class, Division
from subject_app.models import ClassSubject
from employee_app.models import Employee
from student_app.models import Student

import requests
from django.dispatch import receiver
from django.db.models.signals import pre_save, pre_delete
from helloworld_project import settings
from .bussiness.zoom import newJWT


class AccountInfo(models.Model):
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE)
    parentEmployee = models.ForeignKey(Employee, on_delete=models.PROTECT)
    username = models.CharField(max_length=150)
    password = models.CharField(max_length=150)

    class Meta:
        db_table = 'AccountInfo'
        unique_together = ('parentSchool', 'username')


class OnlineClass(models.Model):
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE)
    parentClassSubject = models.ForeignKey(ClassSubject, on_delete=models.CASCADE)
    meetingNumber = models.BigIntegerField(blank=True, null=True)
    password = models.CharField(max_length=10, blank=True, null=True)
    configJSON = models.TextField()

    def __str__(self):
        return str(self.parentSchool.pk) + ' - ' + self.parentSchool.name

    class Meta:
        db_table = 'ActiveClasses'
        unique_together = ('parentSchool', 'parentClassSubject')


class RestrictedStudent(models.Model):
    parentStudent = models.ForeignKey(Student, unique=True, on_delete=models.CASCADE)


# @receiver(pre_save, sender=OnlineClass)
# def createZoomMeeting(sender, instance, **kwargs):
#     if(instance.id): # only for new objects
#         return
#     apiEndPoint = f'https://api.zoom.us/v2/users/{settings.ZOOM_EMAIL_ID}/meetings'
#     jwt = 'Bearer ' + newJWT()

#     headers = {
#         "Authorization": jwt,
#         "Content-Type": "application/json",
#     }

#     data = {
#         "topic": instance.parentClass.name + '-' + instance.parentDivision.name,
#         "type": 3,
#     }

#     response = requests.post(apiEndPoint, json=data, headers=headers)
#     jsonResponse = response.json()
#     instance.meetingNumber = jsonResponse['id']
#     instance.password = jsonResponse['password']

# @receiver(pre_delete, sender=OnlineClass)
# def deleteZoomMetting(sender, instance, **kwargs):
#     apiEndPoint = f'https://api.zoom.us/v2/meetings/{instance.meetingNumber}'
#     jwt = 'Bearer ' + newJWT()

#     headers = {
#         "Authorization": jwt,
#     }

#     response = requests.delete(apiEndPoint, headers=headers)
#     assert response.status_code == 204
