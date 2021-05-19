from django.db import models

# Create your models here.
from school_app.model.models import School
from django.contrib.auth.models import User
from information_app.models import MessageType
from sms_app.models import SMSEvent


class Notification(models.Model):

    # Content
    content = models.TextField(null=False, default='', verbose_name='content')

    parentMessageType = models.ForeignKey(MessageType, on_delete=models.SET_NULL, default=1, null=True)

    parentSMSEvent = models.ForeignKey(SMSEvent, on_delete=models.SET_NULL, null=True)

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


