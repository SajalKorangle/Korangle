from django.db import models

# Create your models here.
from subject_app.models import ClassSubject


class Tutorial(models.Model):
    parentClassSubject = models.ForeignKey(ClassSubject, on_delete=models.PROTECT, null=False, default=0,
                                           verbose_name='parentClassSubject')

    chapter = models.TextField(null=False)
    topic = models.TextField(null=False)
    link = models.TextField(null=False)
    orderNumber = models.DecimalField(null=False, max_digits=8, decimal_places=1)
    generationDateTime = models.DateTimeField(auto_now_add=True, verbose_name='generationDateTime')

    class Meta:
        db_table = 'tutorial'
