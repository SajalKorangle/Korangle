from django.db import models
from common.common import BasePermission

from school_app.model.models import BusStop, Session, School

from class_app.models import Class, Division

from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver

import subject_app
import examination_app

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


@receiver(post_save, sender = StudentSection)
def create_subjects_tests_fees(sender, instance, created, **kwargs):

    if created:

        parentSchool = instance.parentStudent.parentSchool
        parentSession = instance.parentSession
        parentStudent = instance.parentStudent
        parentClass = instance.parentClass
        parentDivision = instance.parentDivision

        # Create Student Subjects
        for class_subject in subject_app.models.ClassSubject.objects.filter(parentSchool = parentSchool, parentSession = parentSession, parentClass = parentClass, parentDivision = parentDivision):
            student_subject = subject_app.models.StudentSubject()
            student_subject.parentSubject = class_subject.parentSubject
            student_subject.parentStudent = parentStudent
            student_subject.parentSession = class_subject.parentSession
            student_subject.save()

        # Create Student Tests
        for test_second in examination_app.models.TestSecond.objects.filter(parentExamination__parentSchool = parentSchool, parentExamination__parentSession = parentSession, parentClass = parentClass, parentDivision = parentDivision):
            student_test = examination_app.models.StudentTest()
            student_test.parentExamination = test_second.parentExamination
            student_test.parentSubject = test_second.parentSubject
            student_test.parentStudent = parentStudent
            student_test.testType = test_second.testType
            student_test.marksObtained = 0
            student_test.save()

        # Create Student Fees.

        from fees_third_app.models import FeeType, SchoolFeeRule, ClassFilterFee, BusStopFilterFee, CustomFilterFee, StudentFee
        # Starts :- Iterating over fee types of the school
        for fee_type_object in FeeType.objects.filter(parentSchool=parentSchool):
            # Starts :- Iterating over school fee rules of a particular fee type
            for school_fee_rule in SchoolFeeRule.objects.filter(parentFeeType = fee_type_object, parentSession = parentSession).order_by('ruleNumber'):

                # Starts :- Checking whether School Fee Rule should be applied to student

                # Starts :- Checking Class Filter
                if (school_fee_rule.isClassFilter):
                    class_filter_fee = ClassFilterFee.objects.filter(
                                            parentSchoolFeeRule = school_fee_rule,
                                            parentClass = parentClass,
                                            parentDivision = parentDivision
                                        )
                    if len(class_filter_fee) == 0:
                        continue
                # Ends :- Checking Class Filter

                # Starts :- Checking Bus Stop Filter
                if (school_fee_rule.isBusStopFilter):
                    bus_stop_filter_fee = BusStopFilterFee.objects.filter(
                                            parentSchoolFeeRule = school_fee_rule,
                                            parentBusStop = parentStudent.currentBusStop
                                        )
                    if len(bus_stop_filter_fee) == 0:
                        continue
                # Ends :- Checking Bus Stop Filter

                # Starts :- Check Custom Filters
                custom_filter_fee_list = CustomFilterFee.objects.filter(
                                        parentSchoolFeeRule=school_fee_rule
                                    )
                student_filtered = True
                for custom_filter_fee_object in custom_filter_fee_list:
                    student_parameter_value = StudentParameterValue.objects.filter(
                        parentStudent=parentStudent,
                        parentStudentParameter=custom_filter_fee_object.parentStudentParameter
                    )
                    # Custom Filter Exists but not student Value
                    if len(student_parameter_value) == 0:
                        student_filtered = False
                        break
                    # Student Value exist but is not in custom filter value list
                    if student_parameter_value[0].value not in custom_filter_fee_object.selectedFilterValues.split(','):
                        student_filtered = False
                        break
                if student_filtered == False:
                    continue
                # Ends :- Check Custom Filters

                # Starts :- Checking New Admission Filter
                if (school_fee_rule.onlyNewAdmission) and (parentStudent.admissionSession != school_fee_rule.parentSession):
                    continue
                # Ends :- Checking New Admission Filter

                # Starts :- Checking RTE Filter
                if (not school_fee_rule.includeRTE) and (parentStudent.rte == 'YES'):
                    continue
                # Starts :- Checking RTE Filter

                # Ends :- Checking whether School Fee Rule should be applied to student

                # Starts :- Adding fees to student
                student_fee_object = StudentFee()

                student_fee_object.parentStudent = parentStudent
                student_fee_object.parentSchoolFeeRule = school_fee_rule
                student_fee_object.parentFeeType = school_fee_rule.parentFeeType
                student_fee_object.parentSession = school_fee_rule.parentSession
                student_fee_object.isAnnually = school_fee_rule.isAnnually
                student_fee_object.cleared = False

                month_list = ['april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december', 'january', 'february', 'march']
                property_list = ['Amount', 'LastDate', 'LateFee', 'MaximumLateFee', 'ClearanceDate']

                for month in month_list:
                    for property in property_list:
                        property_full_name = month + property

                        if property == 'ClearanceDate':
                            setattr(student_fee_object, property_full_name, None)
                        else:
                            setattr(student_fee_object, property_full_name, getattr(school_fee_rule, property_full_name))

                student_fee_object.save()
                # Ends :- Adding fees to student

                break # Breaking loop because only one school fee rule can exist for a student for a fee type

            # Ends :- Iterating over school fee rules of a particular fee type
        # Ends :- Iterating over fee types of the school

@receiver(pre_delete, sender = StudentSection)
def delete_subjects_tests_fees(sender, instance, using, **kwargs):
    
    # Delete Student Fees
    StudentFee.objects.filter(parentStudent=instance.parentStudent,
                                                    parentSession=instance.parentSession).delete()

    # Delete Tests
    examination_app.models.StudentTest.objects.filter(parentStudent=instance.parentStudent,
                                                    parentExamination__parentSession=instance.parentSession).delete()

    # Delete Subjects
    subject_app.models.StudentSubject.objects.filter(parentStudent=instance.parentStudent,
                                                    parentSession=instance.parentSession).delete()

    # Delete Student Extra Sub Fields and CCE Marks
    examination_app.models.StudentExtraSubField.objects.filter(parentStudent=instance.parentStudent,
                                                                parentExamination__parentSession=instance.parentSession).delete()
    examination_app.models.CCEMarks.objects.filter(parentStudent=instance.parentStudent,
                                                    parentSession=instance.parentSession).delete()


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
