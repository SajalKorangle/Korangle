from django.db import models

import os
from django.utils.timezone import now


from django.contrib.auth.models import User
# Create your models here.


def upload_avatar_to(instance, filename):
    filename_base, filename_ext = os.path.splitext(filename)
    return 'features/%s/photo/%s%s' % (instance.id, now().timestamp(), filename_ext.lower())


class Feature(models.Model):

    parentUser = models.ForeignKey(User, on_delete=models.CASCADE, default=0, verbose_name='parentUser')
    generationDateTime = models.DateTimeField(null=False, auto_now_add=True, verbose_name='generationDateTime')

    photo = models.ImageField("Avatar", upload_to=upload_avatar_to, blank=True, null=True)
    title = models.TextField(null=False)
    description = models.TextField(null=False)
    advantage = models.TextField(null=True)
    frequency = models.TextField(null=True)
    managedBy = models.TextField(null=True)

    class Meta:
        db_table = 'feature'


class FeaturePhoto(models.Model):

    photo = models.ImageField("Avatar", upload_to=upload_avatar_to, blank=True, null=True)
    parentFeature = models.ForeignKey(Feature, on_delete=models.CASCADE, default=0, verbose_name='parentFeature')

    class Meta:
        db_table = 'feature_photo'

