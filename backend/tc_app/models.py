from django.db import models
from common.common import BasePermission

from school_app.model.models import School, Session
from student_app.models import Student, StudentSection
from fees_third_app.models import FeeType
from employee_app.models import Employee
from django.utils.timezone import now
from common.common import BasePermission


def upload_thumbnail_to(instance, filename):
    return '%s/tc_layouts/imageAssets/%s_%s' % (instance.parentSchool.id, now().timestamp(), filename)

class TCLayout(models.Model):
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE)
    name = models.CharField(max_length=50, null=True, blank=True)
    thumbnail = models.ImageField(upload_to=upload_thumbnail_to,null=True)
    publiclyShared = models.BooleanField(default=False)
    content = models.TextField()  # Contains the JSON content for the layout
    parentStudentSection = models.ForeignKey(Student, on_delete=models.SET_NULL,
        null=True, blank=True, default=None)  # student section on which this layout is designed

    class Meta:
        unique_together = ('parentSchool', 'name')


class TCLayoutSharing(models.Model):
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE)
    parentLayout = models.ForeignKey(TCLayout, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('parentSchool', 'parentLayout')


def upload_image_assets_to(instance, filename):
    return 'tc_layouts/imageAssets/%s_%s' % (now().timestamp(), filename)

class TCImageAssets(models.Model): # implement image data size
    image = models.ImageField(upload_to=upload_image_assets_to)


class TransferCertificateSettings(models.Model):
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE, unique=True)

    tcFee = models.IntegerField(default=0)  # For fee collection
    parentFeeType = models.ForeignKey(FeeType, on_delete=models.PROTECT, null=True)

    nextCertificateNumber = models.IntegerField(default=0)  # Regarding certificate number



def upload_certificate_to(instance, filename):
    return 'tc_app/TransferCertificateNew/certificateFile/%s-%s' % (now().timestamp(), filename)

class TransferCertificateNew(models.Model):
    parentStudent = models.ForeignKey(Student, on_delete=models.CASCADE, null=True)
    parentStudentSection = models.ForeignKey(StudentSection, on_delete=models.CASCADE, null=True)
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT)
    certificateNumber = models.IntegerField()
    certificateFile = models.FileField(upload_to=upload_certificate_to)

    issueDate = models.DateField(null=True, blank=True)
    leavingDate = models.DateField(null=True, blank=True)
    leavingReason = models.TextField(null=True, blank=True)
    lastClassPassed = models.CharField(null=True, blank=True, max_length=30)

    STATUS = (
        ('Generated', 'Generated'),
        ('Issued', 'Issued'),
        ('Cancelled', 'Cancelled'),
    )
    status = models.CharField(max_length=20, choices=STATUS,)
    generatedBy = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='generated_tc_set')
    issuedBy = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, default=None, related_name='issued_tc_set')
    cancelledBy = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, default=None, related_name='cancelled_tc_set')

    class Permissions(BasePermission):
        RelationsToSchool = ['parentStudent__parentSchool__id']
        RelationsToStudent = ['parentStudent__id']
