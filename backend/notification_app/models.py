from django.db import models

# Create your models here.
from school_app.model.models import School
from django.contrib.auth import get_user_model
User = get_user_model()
from information_app.models import MessageType

from django.dispatch import receiver
from django.db.models.signals import post_save
from .business.send_notification import send_notification


class Notification(models.Model):

    # Content
    content = models.TextField(null=False, default='', verbose_name='content')

    parentMessageType = models.ForeignKey(MessageType, on_delete=models.PROTECT, default=1)

    # Sent Date & Time
    sentDateTime = models.DateTimeField(null=False, auto_now_add=True, verbose_name='sentDateTime')

    # User
    parentUser = models.ForeignKey(User, on_delete=models.PROTECT, default=0, verbose_name='parentUser')

    # School
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, null=True, verbose_name='parentSchool')

    def __str__(self):
        return str(self.parentSchool.pk) + ' - ' + self.parentSchool.name

    class Meta:
        db_table = 'notification'


@receiver(post_save, sender=Notification)
def sendNotification(sender, instance, created, **kwargs):
    if kwargs['raw']:
        return
    if(created):
        send_notification(instance)
