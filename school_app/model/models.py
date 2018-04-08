from django.db import models
from django.contrib.auth.models import User

from school_app.model_custom_field import CustomImageField

from django.core.exceptions import ObjectDoesNotExist

class Session(models.Model):

    startDate = models.DateField()
    endDate = models.DateField()
    name = models.TextField(default='',null=True)
    orderNumber = models.IntegerField(default=0)

    def __str__(self):
        return str(self.startDate) + ' --- ' + str(self.endDate)

    class Meta:
        db_table = 'session'

def get_user():
    if User.objects.filter(username='brightstar'):
        return User.objects.filter(username='brightstar')[0].id
    else:
        return 1

class School(models.Model):

    user = models.ManyToManyField(User)
    name = models.TextField(null=True)
    printName = models.TextField(null=True)
    logo = CustomImageField(use_key=True, upload_to='tmp')
    primaryThemeColor = models.TextField(null=True)
    secondaryThemeColor = models.TextField(null=True)
    complexFeeStructure = models.BooleanField(default=True)
    address = models.TextField(null=True)
    diseCode = models.TextField(null=True)
    currentSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=False, verbose_name='currentSession', default=1)
    
    registrationNumber = models.TextField(null=False, default='426/13.01.1993')

    def get_upload_to(self, attname):
            return 'school/id/{0}'.format(self.id)

    def workingDays(self, session_object):
        try:
            return SchoolSession.objects.get(parentSchool=self, parentSession=session_object).workingDays
        except ObjectDoesNotExist:
            return None

    def __str__(self):
        return self.printName

    class Meta:
        db_table = 'school'

class SchoolSession(models.Model):

    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=False, verbose_name='parentSession')
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, null=False, verbose_name='parentSchool')
    workingDays = models.IntegerField(default=0)

    def __str__(self):
        return self.parentSession.name + ' --- ' + self.parentSchool.name + ' --- ' + str(self.workingDays)

    class Meta:
        db_table = 'school_session'
        unique_together = ( 'parentSession', 'parentSchool' )

class BusStop(models.Model):

    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, null=False, verbose_name='parentSchool')
    stopName = models.TextField(null=False)
    kmDistance = models.DecimalField(max_digits=7, decimal_places=1,null=False, default=0)

    def __str__(self):
        return self.parentSchool.name + ' --- ' + self.stopName + ' --- ' + str(self.kmDistance)

    class Meta:
        db_table = 'bus_stop'
        unique_together = ( 'parentSchool', 'stopName' )
