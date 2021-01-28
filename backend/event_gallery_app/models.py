import os

from django.db import models

# Create your models here.
from django.utils.timezone import now

from class_app.models import Class
from school_app.model.models import School


def upload_event_images_to(instance, filename):
    filename_base, filename_ext = os.path.splitext(filename)
    return 'events/%s/images/%s%s' % (instance.id, now().timestamp(), filename_ext.lower())


class Event(models.Model):
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE, null=False, default=0,
                                     verbose_name='parentSchool')
    eventTitle = models.TextField(null=False, default='', verbose_name='eventTitle')
    eventDescription = models.TextField(null=True, blank=True, verbose_name='eventDescription')
    heldOn = models.DateTimeField(null=True, verbose_name='heldOn')
    generationDateTime = models.DateTimeField(auto_now_add=True, verbose_name='generationDateTime')
    notifyEmployees = models.BooleanField(null=False, default=False, verbose_name='notifyEmployees')

    class Meta:
        db_table = 'event'


class NotifyClass(models.Model):
    parentEvent = models.ForeignKey(Event, on_delete=models.CASCADE, null=False, default=0,
                                    verbose_name='parentEvent')
    parentClass = models.ForeignKey(Class, on_delete=models.CASCADE, null=False, default=0,
                                    verbose_name='parentClass')

    class Meta:
        db_table = 'notify_class'


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
    imageSize = models.TextField(null=True, blank=True,verbose_name='imageSize')
    orderNumber = models.IntegerField(null=False, default=0, verbose_name='orderNumber')

    class Meta:
        db_table = 'event_images'


class ImageTags(models.Model):
    parentEventImage = models.ForeignKey(EventImage, on_delete=models.CASCADE, null=False, default=0,
                                         verbose_name='parentEventImage')
    parentEventTag = models.ForeignKey(EventTag, on_delete=models.CASCADE, null=False, default=0,
                                       verbose_name='parentEventTag')

    class Meta:
        db_table = 'image_tags'
