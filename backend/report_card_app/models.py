from django.db import models
from school_app.model.models import School
from django.dispatch import receiver
from django.db.models.signals import pre_save, pre_delete

import os
from django.utils.timezone import now

def upload_report_card_to(instance, filename):
    filename_base, filename_ext = os.path.splitext(filename)
    return 'report_cards/%s/background/%s%s' % (instance.id, now().timestamp(), filename_ext.lower())

# Create your models here.
class ReportCardLayout(models.Model):
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE)
    name = models.CharField(max_length=50, null=True, blank=True)
    # Contains the JSON content for the layout
    content = models.TextField()
    # Background
    background = models.ImageField("report_card_background", upload_to=upload_report_card_to, blank=True, null=True)

    class Meta:
        unique_together = ('parentSchool', 'name')

class ReportCardLayoutNew(models.Model):
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE)
    name = models.CharField(max_length=50, null=True, blank=True)
    content = models.TextField()    # Contains the JSON content for the layout
    
    class Meta:
        unique_together = ('parentSchool', 'name')

class ImageAssets(models.Model):
    parentLayout = models.ForeignKey(ReportCardLayoutNew, on_delete=models.CASCADE, blank=False)
    image = models.ImageField(upload_to="report_cards/imageAssets")


