from django.db import models

from school_app.model.models import BusStop, Session, School

from class_app.models import Class, Division

from django.contrib.auth.models import User

from django.core.exceptions import ObjectDoesNotExist

import os
from django.utils.timezone import now


'''def upload_avatar_to(instance, filename):
    import os
    from django.utils.timezone import now
    filename_base, filename_ext = os.path.splitext(filename)
    return 'students/%s/main%s' % (instance.id, filename_ext.lower())'''


def upload_avatar_to(instance, filename):
    filename_base, filename_ext = os.path.splitext(filename)
    return 'students/%s/profile_image/%s%s' % (instance.id, now().timestamp(), filename_ext.lower())


class TransferCertificate(models.Model):

    certificateNumber = models.IntegerField(null=False)
    issueDate = models.DateField(null=False)
    # admissionDate = models.DateField(null=False)
    leavingDate = models.DateField(null=False)
    leavingReason = models.TextField(null=False)
    admissionClass = models.TextField(null=False)
    lastClassPassed = models.TextField(null=False)
    leavingMidSession = models.BooleanField(default=False)
    lastClassAttended = models.TextField(null=True)
    lastClassAttendance = models.IntegerField(null=True)
    attendanceOutOf = models.IntegerField(null=True)

    class Meta:
        db_table = 'student_transfer_certificate'


class Student(models.Model):

    profileImage = models.ImageField("Avatar", upload_to=upload_avatar_to, blank=True)

    name = models.CharField(max_length=100)
    fathersName = models.CharField(max_length=100)
    mobileNumber = models.IntegerField(null=True)
    secondMobileNumber = models.IntegerField(null=True)
    scholarNumber = models.TextField(null=True, blank=True)
    totalFees = models.IntegerField(default=0)
    dateOfBirth = models.DateField(null=True)
    remark = models.TextField(null=True, blank=True)

    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0)

    # new student profile data
    motherName = models.TextField(null=True, blank=True)
    gender = models.TextField(null=True, blank=True)
    caste = models.TextField(null=True, blank=True)

    CATEGORY = (
        ( 'SC', 'Scheduled Caste' ),
        ( 'ST', 'Scheduled Tribe' ),
        ( 'OBC', 'Other Backward Classes' ),
        ( 'Gen.', 'General' ),
    )
    newCategoryField = models.CharField(max_length=5, choices=CATEGORY, null=True)

    RELIGION = (
        ( 'Hinduism', 'Hinduism' ),
        ( 'Islam', 'Islam' ),
        ( 'Christianity', 'Christianity' ),
        ( 'Jainism', 'Jainism' ),
    )
    newReligionField = models.CharField(max_length=20, choices=RELIGION, null=True)

    fatherOccupation = models.TextField(null=True)
    address = models.TextField(null=True, blank=True)
    familySSMID = models.IntegerField(null=True)
    childSSMID = models.IntegerField(null=True)
    bankName = models.TextField(null=True, blank=True)
    bankIfscCode = models.TextField(null=True, blank=True)
    bankAccountNum = models.TextField(null=True, blank=True)
    aadharNum = models.IntegerField(null=True)
    bloodGroup = models.TextField(null=True, blank=True)
    fatherAnnualIncome = models.TextField(null=True, blank=True)

    currentBusStop = models.ForeignKey(BusStop, on_delete=models.PROTECT, null=True, verbose_name='current_bus_stop')

    RTE_YES = 'YES'
    RTE_NO = 'NO'
    RTE_UNKNOWN = 'UNKNOWN'
    RTE = (
        ('YES', 'Yes'),
        ('NO', 'No'),
        ('UNKNOWN', 'Unknown')
    )

    rte = models.CharField(max_length=10, choices=RTE, null=True)

    admissionSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=True, verbose_name='admissionSession')
    dateOfAdmission = models.DateField(null=True, verbose_name='dateOfAdmission')

    parentTransferCertificate = \
        models.ForeignKey(TransferCertificate, on_delete=models.SET_NULL, null=True, verbose_name='parentTransferCertificate')

    def __str__(self):
        """A string representation of the model."""
        return self.parentSchool.name+" --- "+self.name

    def get_section_id(self, session_object):
        return self.studentsection_set\
            .get(parentSession=session_object).parentDivision.id

    def get_section_name(self, session_object):
        return self.studentsection_set\
            .get(parentSession=session_object).parentDivision.name

    def get_class_object(self, session_object):
        return self.studentsection_set.get(parentSession=session_object)\
            .parentClass

    def get_class_id(self, session_object):
        return self.studentsection_set\
            .get(parentSession=session_object).parentClass.id

    def get_class_name(self, session_object):
        try:
            return self.studentsection_set \
                .get(parentSession=session_object).parentClass.name
        except ObjectDoesNotExist:
            return None

    def get_rollNumber(self, session_object):
        return self.studentsection_set \
            .get(parentSession=session_object).rollNumber

    class Meta:
        db_table = 'student'

'''
    def save(self, profileImageUpdation = False, *args, **kwargs):
        super(Student, self).save(*args, **kwargs)
        if profileImageUpdation:
            self.create_avatar_thumb()

    def create_avatar_thumb(self):
        import os
        from PIL import Image
        from django.core.files.storage import default_storage as storage
        if not self.profileImage:
            return ""
        file_path = self.profileImage.name
        filename_base, filename_ext = os.path.splitext(file_path)
        thumb_file_path = "%s_thumb%s" % (filename_base, filename_ext.lower())
        try:
            # resize the original image and return url path of the thumbnail
            f = storage.open(file_path, 'r')
            image = Image.open(f)
            width, height = image.size

            if width > height:
                delta = width - height
                left = int(delta/2)
                upper = 0
                right = height + left
                lower = height
            else:
                delta = height - width
                left = 0
                upper = int(delta/2)
                right = width
                lower = width + upper

            imageTwo = image.crop((left, upper, right, lower))
            imageTwo = imageTwo.resize((100, 100), Image.ANTIALIAS)

            f_thumb = storage.open(thumb_file_path, "w")
            imageTwo.save(f_thumb, format="PNG")
            f_thumb.close()

            return "success"
        except:
            return "error"

    def get_avatar_thumb_url(self):
        import os
        from django.core.files.storage import default_storage as storage
        if not self.profileImage:
            return ""
        file_path = self.profileImage.name
        filename_base, filename_ext = os.path.splitext(file_path)
        thumb_file_path = "%s_thumb.jpg" % filename_base
        if storage.exists(thumb_file_path):
            return storage.url(thumb_file_path)
        return ""
'''


class StudentSection(models.Model):

    parentStudent = models.ForeignKey(Student, on_delete=models.PROTECT, default=0, verbose_name='parentStudent')

    parentClass = models.ForeignKey(Class, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentClass')
    parentDivision = models.ForeignKey(Division, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentDivision')
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentSession')

    rollNumber = models.TextField(null=True)
    attendance = models.IntegerField(null=True)

    class Meta:
        db_table = 'student_section'
        unique_together = ('parentStudent', 'parentClass', 'parentSession')
        unique_together = ('parentStudent', 'parentDivision', 'parentSession')
