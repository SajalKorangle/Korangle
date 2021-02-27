from django.db import models

from school_app.model.models import School
from django.utils.timezone import now

class TCLayout(models.Model):
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE)
    name = models.CharField(max_length=50, null=True, blank=True)
    thumbnail = models.ImageField(upload_to="report_cards/layout_thumbnails",null=True)
    publiclyShared = models.BooleanField(default=False)
    content = models.TextField()    # Contains the JSON content for the layout
    
    class Meta:
        unique_together = ('parentSchool', 'name')


class LayoutSharing(models.Model):
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE)
    parentLayout = models.ForeignKey(TCLayout, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('parentSchool', 'parentLayout')


def upload_image_assets_to(instance, filename):
    return '%s/tc_layouts/imageAssets/%s_%s' % (instance.parentLayout.parentSchool.id, now().timestamp(), filename)

class ImageAssets(models.Model): # implement image data size
    parentLayout = models.ForeignKey(TCLayout, on_delete=models.CASCADE, blank=False)
    image = models.ImageField(upload_to=upload_image_assets_to)


