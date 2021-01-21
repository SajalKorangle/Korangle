import os

from django.db import models

# Create your models here.
from django.utils.timezone import now

from school_app.model.models import School


def upload_event_images_to(instance, filename):
    filename_base, filename_ext = os.path.splitext(filename)
    return 'events/%s/images/%s%s' % (instance.id, now().timestamp(), filename_ext.lower())


class Event(models.Model):
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE, null=False, default=0,
                                     verbose_name='parentSchool')
    eventTitle = models.TextField(null=False, default='', verbose_name='eventTitle')
    eventDescription = models.TextField(null=True, blank=True, verbose_name='eventDescription')
    generationDateTime = models.DateTimeField(auto_now_add=True, verbose_name='generationDateTime')
    notifyEmployees = models.BooleanField(null=False, default=False, verbose_name='notifyEmployees')
    notifyTeachers = models.BooleanField(null=False, default=False, verbose_name='notifyTeachers')
    notifyClass1 = models.BooleanField(null=False, default=False, verbose_name='notifyClass1')
    notifyClass2 = models.BooleanField(null=False, default=False, verbose_name='notifyClass2')
    notifyClass3 = models.BooleanField(null=False, default=False, verbose_name='notifyClass3')
    notifyClass4 = models.BooleanField(null=False, default=False, verbose_name='notifyClass4')
    notifyClass5 = models.BooleanField(null=False, default=False, verbose_name='notifyClass5')
    notifyClass6 = models.BooleanField(null=False, default=False, verbose_name='notifyClass6')
    notifyClass7 = models.BooleanField(null=False, default=False, verbose_name='notifyClass7')
    notifyClass8 = models.BooleanField(null=False, default=False, verbose_name='notifyClass8')
    notifyClass9 = models.BooleanField(null=False, default=False, verbose_name='notifyClass9')
    notifyClass10 = models.BooleanField(null=False, default=False, verbose_name='notifyClass10')
    notifyClass11 = models.BooleanField(null=False, default=False, verbose_name='notifyClass11')
    notifyClass12 = models.BooleanField(null=False, default=False, verbose_name='notifyClass12')

    class Meta:
        db_table = 'event'


class EventTag(models.Model):
    parentEvent = models.ForeignKey(Event, on_delete=models.CASCADE, null=False, default=0,
                                    verbose_name='parentEvent')
    tagName = models.TextField(null=False, default='', verbose_name='tagName')

    class Meta:
        db_table = 'tag'


class EventImage(models.Model):
    parentEvent = models.ForeignKey(Event, on_delete=models.CASCADE, null=False, default=0,
                                    verbose_name='parentEvent')
    eventImage = models.ImageField('event_image', upload_to=upload_event_images_to, blank=True, null=True)
    orderNumber = models.IntegerField(null=False, default=0, verbose_name='orderNumber')
    tags = models.ManyToManyField(to=EventTag)

    class Meta:
        db_table = 'event_images'
