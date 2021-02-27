from django.db import models

from school_app.model.models import School
from student_app.models import Student
from fees_third_app.models import FeeType
from employee_app.models import Employee
from django.utils.timezone import now

class TCLayout(models.Model):
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE)
    name = models.CharField(max_length=50, null=True, blank=True)
    thumbnail = models.ImageField(upload_to="report_cards/layout_thumbnails",null=True)
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
    return '%s/tc_layouts/imageAssets/%s_%s' % (instance.parentLayout.parentSchool.id, now().timestamp(), filename)

class TCImageAssets(models.Model): # implement image data size
    parentLayout = models.ForeignKey(TCLayout, on_delete=models.CASCADE, blank=False)
    image = models.ImageField(upload_to=upload_image_assets_to)


class TransferCertificateSettings(models.Model):
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE)  
    
    tcFee = models.IntegerField(default=0)  # For fee collection
    parentFeeType = models.ForeignKey(FeeType, on_delete=models.PROTECT, null=True)
    
    lastCertificateNumber = models.IntegerField(default=0)  # Regarding certificate number



class TransferCertificateNew(models.Model):
    parentStudent = models.OneToOneField(Student, on_delete=models.CASCADE, related_name='transferCertificateNew')
    certificateNumber = models.IntegerField(null=True, blank=True)

    issueDate = models.DateField(null=True, blank=True)
    leavingDate = models.DateField(null=True, blank=True)
    leavingReason = models.TextField(null=True, blank=True)

    STATUS = (
        ('Generated', 'Generated'),
        ('Issued', 'Issued'),
        ('Cancelled', 'Cancelled'),
    )
    status = models.CharField(max_length=20, choices=STATUS, null=False, blank=True)
    generatedBy = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='generated_tc_set')
    issuedBy = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='issued_tc_set')
    cancelledBy = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='cancelled_tc_set')