from django.db import models

# Create your models here.
from subject_app.models import ClassSubject
from school_app.model.models import School
from information_app.models import SentUpdateType


class Tutorial(models.Model):
    parentClassSubject = models.ForeignKey(ClassSubject, on_delete=models.CASCADE, null=False, default=0,
                                           verbose_name='parentClassSubject')

    chapter = models.TextField(null=False)
    topic = models.TextField(null=False)
    link = models.TextField(null=False)
    orderNumber = models.DecimalField(null=False, max_digits=8, decimal_places=1)
    generationDateTime = models.DateTimeField(auto_now_add=True, verbose_name='generationDateTime')

    class Meta:
        db_table = 'tutorial'

class TutorialSettings(models.Model):
    
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0, verbose_name='parentSchool')

    sentUpdateType = models.ForeignKey(SentUpdateType, on_delete=models.PROTECT, default=0)

    sendCreateUpdate = models.BooleanField(null=False, default=True, verbose_name='sendCreateUpdate')
    sendEditUpdate = models.BooleanField(null=False, default=True, verbose_name='sendEditUpdate')
    sendDeleteUpdate = models.BooleanField(null=False, default=True, verbose_name='sendDeleteUpdate')
