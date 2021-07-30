from django.db import models
from school_app.model.models import School
from django.utils.timezone import now


def upload_thumbnail_to(instance, filename):
    return '%s/my_design/imageAssets/%s_%s' % (instance.parentSchool.id, now().timestamp(), filename)

class Layout(models.Model):
    TYPE_CHOICES = (
        ('REPORT CARD', 'REPORT CARD'),
        ('TC', 'TC'),
    )
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE)
    name = models.CharField(max_length=50, null=True, blank=True)
    thumbnail = models.ImageField(upload_to=upload_thumbnail_to, null=True)
    publiclyShared = models.BooleanField(default=False)
    content = models.TextField()    # Contains the JSON content for the layout
    
    class Meta:
        unique_together = ('type', 'parentSchool', 'name')


class LayoutSharing(models.Model):
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE, related_name='sharing_school')
    parentLayout = models.ForeignKey(Layout, on_delete=models.CASCADE, related_name='sharing_layout')

    class Meta:
        unique_together = ('parentSchool', 'parentLayout')



def upload_image_assets_to(instance, filename):
    return 'rc_layouts/imageAssets/%s_%s' % (now().timestamp(), filename)

class ImageAssets(models.Model):
    image = models.ImageField(upload_to=upload_image_assets_to)