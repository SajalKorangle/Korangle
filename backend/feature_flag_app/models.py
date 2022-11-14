from django.db import models

from common.common import BasePermission

# Create your models here.


class FeatureFlag(models.Model):

    name = models.TextField(default='', null=False, verbose_name='name')
    enabled = models.BooleanField(default=False, null=False, verbose_name='enabled')

    def __str__(self):
        return str(self.name) + ' -- ' + str(self.enabled)

    class Meta:
        db_table = 'feature_flag'

    class Permissions(BasePermission):
        RelationsToSchool = []
        RelationsToStudent = []


