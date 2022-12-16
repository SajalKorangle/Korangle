from django.db import models

import os
from django.utils.timezone import now

from school_app.model.models import School
from common.common import BasePermission

# Create your models here.


def upload_signature_image_to(instance, filename):
    filename_base, filename_ext = os.path.splitext(filename)
    return 'schools/%s/%s/%s/signature_image/%s%s' % (instance.parentSchool.id, instance.parentClass.name, instance.parentDivision.name, now().timestamp(), filename_ext.lower())


class Class(models.Model):
    name = models.TextField()
    orderNumber = models.IntegerField(default=0)

    def __str__(self):
        """A string representation of the model."""
        return self.name

    class Permissions(BasePermission):
        RelationsToSchool = []
        RelationsToStudent = []

    class Meta:
        db_table = 'class'
        ordering = ['orderNumber']


class Division(models.Model):
    name = models.TextField()
    orderNumber = models.IntegerField(default=0)

    def __str__(self):
        return self.name

    class Permissions(BasePermission):
        RelationsToSchool = []
        RelationsToStudent = []

    class Meta:
        db_table = 'division'
        ordering = ['orderNumber']


class ClassTeacherSignature(models.Model):

    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE, null=False, verbose_name='parentSchool')
    parentClass = models.ForeignKey(Class, on_delete=models.PROTECT, null=False, verbose_name='parentClass')
    parentDivision = models.ForeignKey(Division, on_delete=models.PROTECT, null=False, verbose_name='parentDivision')
    signatureImage = models.ImageField("SignatureImage", upload_to=upload_signature_image_to, blank=True, null=True)

    class Meta:
        db_table = 'class_teacher_signature'
        unique_together = ('parentSchool', 'parentClass', 'parentDivision')
