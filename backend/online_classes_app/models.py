from django.db import models

# Create your models here.
from school_app.model.models import School
from class_app.models import Class, Division


class ActiveClass(models.Model):

    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE, null=False, default=0, verbose_name='parentSchool')
    parentClass = models.ForeignKey(Class, null=False, default=0, verbose_name='parentClass')
    parentDivision = models.ForeignKey(Division, null=False, default=0, verbose_name='parentDivision')
    startTime = models.TimeField(null=True, verbose_name='startTime')
    endTime = models.TimeField(null=True, verbose_name='endTime')

    def __str__(self):
        return str(self.parentSchool.pk) + ' - ' + self.parentSchool.name

    class Meta:
        db_table = 'ActiveClasses'
        unique_together=('parentSchool', 'parentClass', 'parentDivision')
