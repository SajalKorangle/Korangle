from django.db import models

# Create your models here.
from school_app.model.models import School
from class_app.models import Class, Division

import requests
from django.dispatch import receiver
from django.db.models.signals import pre_save
from helloworld_project import settings
from .bussiness.zoom import newJWT

class OnlineClass(models.Model):
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE)
    parentClass = models.ForeignKey(Class)
    parentDivision = models.ForeignKey(Division)
    startTime = models.TimeField(null=True, verbose_name='startTime')
    endTime = models.TimeField(null=True, verbose_name='endTime')
    meetingNumber = models.BigIntegerField(blank=True)
    password = models.CharField(max_length=10, blank=True)
    configJSON = models.TextField()

    def __str__(self):
        return str(self.parentSchool.pk) + ' - ' + self.parentSchool.name

    class Meta:
        db_table = 'ActiveClasses'
        unique_together=('parentSchool', 'parentClass', 'parentDivision')


@receiver(pre_save, sender=OnlineClass)
def createZoomMeeting(sender, instance, **kwargs):
    apiEndPoint = 'https://api.zoom.us/v2/users/'+settings.ZOOM_EMAIL_ID+'/meetings'
    jwt = 'Bearer ' + newJWT()

    headers = {
        "Authorization": jwt,
        "Content-Type": "application/json",
    }

    data = {
        "topic": instance.parentClass.name + '-' + instance.parentDivision.name,
        "type": 3,
    }

    response = requests.post(apiEndPoint, json=data, headers=headers)
    jsonResponse = response.json()
    instance.meetingNumber = jsonResponse['id']
    instance.password = jsonResponse['password']
