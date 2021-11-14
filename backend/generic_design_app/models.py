from django.db import models
from school_app.model.models import School
from django.utils.timezone import now
from common.common import BasePermission
from django.db.models import Q


def upload_thumbnail_to(instance, filename):
    return 'my_design/imageAssets/%s/%s_%s' % (instance.parentSchool.id, now().timestamp(), filename)


class Layout(models.Model):
    TYPE_CHOICES = (
        ('REPORT CARD', 'REPORT CARD'),
        ('TC', 'TC'),
    )
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE, related_name='layoutList')
    name = models.CharField(max_length=50, null=True, blank=True)
    thumbnail = models.ImageField(upload_to=upload_thumbnail_to, null=True)
    publiclyShared = models.BooleanField(default=False)
    content = models.JSONField()    # Contains the JSON content for the layout

    class Permissions(BasePermission):

        RelationsToSchool = ['parentSchool__id']

        def getPermittedQuerySet(self, activeSchoolId, activeStudentIdList):
            permittedQuerySet = super().getPermittedQuerySet(activeSchoolId, activeStudentIdList)
            sharedLayoutList = LayoutShare.objects.filter(parentSchoolSharedWith=activeSchoolId).values_list('parentLayout', flat=True)
            return permittedQuerySet | Q(id__in=sharedLayoutList)

    class Meta:
        unique_together = ('type', 'parentSchool', 'name')


class LayoutShare(models.Model):
    parentSchoolSharedWith = models.ForeignKey(School, on_delete=models.CASCADE, related_name='layoutSharedWithMeList')
    parentLayout = models.ForeignKey(Layout, on_delete=models.CASCADE, related_name='layoutShareList')

    class Permissions(BasePermission):
        RelationsToSchool = ['parentLayout__parentSchool__id']

        def getPermittedQuerySet(self, activeSchoolId, activeStudentIdList):
            permittedQuerySet = super().getPermittedQuerySet(activeSchoolId, activeStudentIdList)
            return permittedQuerySet | Q(parentSchoolSharedWith=activeSchoolId)

    class Meta:
        unique_together = ('parentSchoolSharedWith', 'parentLayout')


def upload_image_assets_to(instance, filename):
    return 'my_design/imageAssets/%s_%s' % (now().timestamp(), filename)


class ImageAssets(models.Model):
    image = models.ImageField(upload_to=upload_image_assets_to)

    class Permissions(BasePermission):
        pass