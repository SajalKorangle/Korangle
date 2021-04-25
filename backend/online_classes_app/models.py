from django.db import models

# Create your models here.
from school_app.model.models import School
from class_app.models import Class, Division

class OnlineClass(models.Model):
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE)
    parentClass = models.ForeignKey(Class)
    parentDivision = models.ForeignKey(Division)
    startTime = models.TimeField(null=True, verbose_name='startTime')
    endTime = models.TimeField(null=True, verbose_name='endTime')
    mettingNumber = models.BigIntegerField()
    passCode = models.CharField(max_length=10)

    def __str__(self):
        return str(self.parentSchool.pk) + ' - ' + self.parentSchool.name

    class Meta:
        db_table = 'ActiveClasses'
        unique_together=('parentSchool', 'parentClass', 'parentDivision')