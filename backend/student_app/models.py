from django.db import models
from common.common import BasePermission

from school_app.model.models import BusStop, Session, School

from class_app.models import Class, Division

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
    return 'students/profile_image/%s%s' % (now().timestamp(), filename_ext.lower())

def upload_document_to(instance,filename):
    return 'student_app/StudentParameterValue/document_value/%s_%s' % (now().timestamp(),filename)


class TransferCertificate(models.Model):

    certificateNumber = models.BigIntegerField(null=False)
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

    profileImage = models.ImageField("Avatar", upload_to=upload_avatar_to, blank=True, null=True)

    name = models.CharField(max_length=100)
    fathersName = models.CharField(max_length=100)
    mobileNumber = models.BigIntegerField(null=True)
    secondMobileNumber = models.BigIntegerField(null=True)
    scholarNumber = models.TextField(null=True, blank=True)
    dateOfBirth = models.DateField(null=True)
    remark = models.TextField(null=True, blank=True)

    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0, related_name="studentList")

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

    fatherOccupation = models.TextField(null=True,blank=True)
    address = models.TextField(null=True, blank=True)
    familySSMID = models.BigIntegerField(null=True)
    childSSMID = models.BigIntegerField(null=True)
    bankName = models.TextField(null=True, blank=True)
    bankIfscCode = models.TextField(null=True, blank=True)
    bankAccountNum = models.TextField(null=True, blank=True)
    aadharNum = models.BigIntegerField(null=True)
    bloodGroup = models.TextField(null=True, blank=True)
    fatherAnnualIncome = models.TextField(null=True, blank=True)

    currentBusStop = models.ForeignKey(BusStop, on_delete=models.PROTECT, null=True, verbose_name='current_bus_stop',  related_name="studentList")

    RTE_YES = 'YES'
    RTE_NO = 'NO'
    RTE = (
        ('YES', 'Yes'),
        ('NO', 'No'),
    )

    rte = models.CharField(max_length=10, choices=RTE, null=True)

    admissionSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=True, verbose_name='admissionSession', related_name="studentList")
    parentAdmissionClass = models.ForeignKey(Class, blank=True, null=True, on_delete=models.SET_NULL, related_name="studentList")
    dateOfAdmission = models.DateField(null=True, verbose_name='dateOfAdmission')

    parentTransferCertificate = \
        models.ForeignKey(TransferCertificate, on_delete=models.SET_NULL, null=True, verbose_name='parentTransferCertificate', related_name="studentList")


    def __str__(self):
        """A string representation of the model."""
        return self.parentSchool.name+" --- "+self.name

    def get_section_id(self, session_object):
        return self.studentSectionList\
            .get(parentSession=session_object).parentDivision.id

    def get_section_name(self, session_object):
        return self.studentSectionList\
            .get(parentSession=session_object).parentDivision.name

    def get_class_object(self, session_object):
        return self.studentSectionList.get(parentSession=session_object)\
            .parentClass

    def get_class_id(self, session_object):
        return self.studentSectionList\
            .get(parentSession=session_object).parentClass.id

    def get_class_name(self, session_object):
        try:
            return self.studentSectionList \
                .get(parentSession=session_object).parentClass.name
        except ObjectDoesNotExist:
            return None

    def get_rollNumber(self, session_object):
        return self.studentSectionList \
            .get(parentSession=session_object).rollNumber

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']
        RelationsToStudent = ['id']

    class Meta:
        db_table = 'student'


class StudentSection(models.Model):

    parentStudent = models.ForeignKey(Student, on_delete=models.CASCADE, default=0, verbose_name='parentStudent', related_name="studentSectionList")

    parentClass = models.ForeignKey(Class, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentClass', related_name="studentSectionList")
    parentDivision = models.ForeignKey(Division, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentDivision', related_name="studentSectionList")
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentSession', related_name="studentSectionList")

    rollNumber = models.TextField(null=True, blank=True)

    class Permissions(BasePermission):
        RelationsToSchool = ['parentStudent__parentSchool__id']
        RelationsToStudent = ['parentStudent__id']

    class Meta:
        db_table = 'student_section'
        unique_together = ('parentStudent', 'parentClass', 'parentSession')
        unique_together = ('parentStudent', 'parentDivision', 'parentSession')


class StudentParameter(models.Model):

    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE, default=0, verbose_name='parentSchool')

    name = models.CharField(max_length=100)

    PARAMETER_TYPE = (
        ( 'TEXT', 'TEXT' ),
        ( 'FILTER', 'FILTER' ),
        ( 'DOCUMENT','DOCUMENT')
    )
    parameterType = models.CharField(max_length=20, choices=PARAMETER_TYPE, null=False)

    filterValues = models.TextField(null=True, blank=True)

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']
        RelationsToStudent = []

    class Meta:
        db_table = 'student_parameter'


class StudentParameterValue(models.Model):

    parentStudent = models.ForeignKey(Student, on_delete=models.CASCADE, default=0, verbose_name='parentStudent')
    parentStudentParameter = models.ForeignKey(StudentParameter, on_delete=models.CASCADE, default=0, verbose_name='parentStudentParameter')

    value = models.TextField(null=True,blank=True)
    document_value = models.FileField(upload_to=upload_document_to, max_length=500, blank=True, null=True)
    document_size = models.TextField(null=True,blank=True)

    class Permissions(BasePermission):
        RelationsToSchool = ['parentStudentParameter__parentSchool__id']
        RelationsToStudent = ['parentStudent__id']

    class Meta:
        db_table = 'student_parameter_value'
        unique_together = ('parentStudent', 'parentStudentParameter')


class CountAllTable(models.Model):
    formatName = models.CharField(max_length=50)
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE, default=0, related_name="countAllTableList")
    rows = models.JSONField()    # It will store all the rows of the table in JSON format.
    cols = models.JSONField()    # It will store all the columns of the table in JSON format.

    def __str__(self):
        return self.formatName

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']

    class Meta:
        db_table = 'count_all_table'
