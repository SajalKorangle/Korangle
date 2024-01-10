
import os
from django.utils.timezone import now

from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()

from school_app.model_custom_field import CustomImageField

from django.core.exceptions import ObjectDoesNotExist

from django.core.files.storage import default_storage as storage

from common.common import BasePermission



def upload_avatar_to(instance, filename):
    filename_base, filename_ext = os.path.splitext(filename)
    return 'schools/%s/profile_image/%s%s' % (instance.id, now().timestamp(), filename_ext.lower())


def upload_principal_signature_to(instance, filename):
    filename_base, filename_ext = os.path.splitext(filename)
    return 'schools/%s/principal_signature/%s%s' % (instance.id, now().timestamp(), filename_ext.lower())


class Board(models.Model):

    name = models.TextField(default='',null=False)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'board'
        ordering = ['id']


class Session(models.Model):

    startDate = models.DateField()
    endDate = models.DateField()
    name = models.TextField(default='',null=True)
    orderNumber = models.IntegerField(default=0)

    def __str__(self):
        return str(self.startDate) + ' --- ' + str(self.endDate)

    class Permissions(BasePermission):
        RelationsToSchool = []
        RelationsToStudent = []

    class Meta:
        db_table = 'session'
        ordering = ['orderNumber']


def get_user():
    if User.objects.filter(username='brightstar'):
        return User.objects.filter(username='brightstar')[0].id
    else:
        return 1


class School(models.Model):

    # user = models.ManyToManyField(User)
    name = models.TextField(null=True)
    printName = models.TextField(null=True)

    # logo = CustomImageField(use_key=True, upload_to='tmp')

    profileImage = models.ImageField("Avatar", upload_to=upload_avatar_to, blank=True)

    principalSignatureImage = models.ImageField("Principal Signature", upload_to=upload_principal_signature_to, blank=True)

    mobileNumber = models.BigIntegerField(null=True)

    expired = models.BooleanField(default=False, verbose_name='expired')
    dateOfExpiry = models.DateField(default=None, null=True, blank=True, verbose_name='date_of_expiry')
    dateOfCreation = models.DateField(default=None, null=True, blank=True, verbose_name='date_of_creation')

    primaryThemeColor = models.TextField(null=True)
    secondaryThemeColor = models.TextField(null=True)

    # address is now considered as street address
    address = models.TextField(null=True, blank=True)
    pincode = models.BigIntegerField(null=True, verbose_name='pincode', blank=True)
    villageCity = models.TextField(null=True, verbose_name='villageCity', blank=True)
    block = models.TextField(null=True, verbose_name='block', blank=True)
    district = models.TextField(null=True, verbose_name='district', blank=True)
    state = models.TextField(null=True, verbose_name='state', blank=True)

    diseCode = models.TextField(null=True)
    currentSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=False, verbose_name='currentSession', default=1)
    registrationNumber = models.TextField(null=False, default='426/13.01.1993')
    affiliationNumber = models.TextField(null=True, blank=True)

    opacity = models.DecimalField(max_digits=3, decimal_places=2,null=False, verbose_name='opacity', default=0.1)

    parentBoard = models.ForeignKey(Board, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentBoard')

    ENGLISH = 'ENGLISH'
    HINDI = 'HINDI'
    MEDIUM = (
        (ENGLISH, 'English'),
        (HINDI, 'Hindi'),
    )
    medium = models.CharField(max_length=15, choices=MEDIUM, null=False, default=ENGLISH)

    HEADER_SIZE_BIG = 'BIG'
    HEADER_SIZE_SMALL = 'SMALL'
    HEADER_SIZE = (
        (HEADER_SIZE_BIG, 'Big'),
        (HEADER_SIZE_SMALL, 'Small'),
    )
    headerSize = models.CharField(max_length=15, choices=HEADER_SIZE, null=False, default=HEADER_SIZE_SMALL)


    def get_upload_to(self, attname):
            return 'school/id/{0}'.format(self.id)

    def workingDays(self, session_object):
        try:
            return SchoolSession.objects.get(parentSchool=self, parentSession=session_object).workingDays
        except ObjectDoesNotExist:
            return None

    def __str__(self):
        return str(self.pk) + ' - ' + self.printName

    class Permissions(BasePermission):
        RelationsToSchool = ['id']
        RelationsToStudent = []

    class Meta:
        db_table = 'school'


class SchoolSummary(models.Model):  # testing code
    name = models.TextField(null=True)
    printName = models.TextField(null=True)
    profileImage = models.ImageField("Avatar", upload_to=upload_avatar_to, blank=True)
    class Meta:
        managed = False
        db_table = "school"


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

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']
        RelationsToStudent = []

    class Meta:
        db_table = 'bus_stop'
        unique_together = ( 'parentSchool', 'stopName' )

class SchoolExpiryInformationJobsReport(models.Model):
    STATUS_CHOICES = (
        ('INITIATED', 'INITIATED'),
        ('SENT', 'SENT'),
    )

    date = models.DateField(auto_now_add=True, unique=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='INITIATED', blank=True)

    def __str__(self):
        return '{0} : {1}'.format(self.date.strftime("%d-%m-%Y"), self.status)
