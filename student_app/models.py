from django.db import models

from school_app.model.models import BusStop

from class_app.models import Section

from django.contrib.auth.models import User

from django.core.exceptions import ObjectDoesNotExist


class Student(models.Model):

    name = models.CharField(max_length=100)
    fathersName = models.CharField(max_length=100)
    mobileNumber = models.IntegerField(null=True)
    # rollNumber = models.TextField(null=True)
    scholarNumber = models.TextField(null=True)
    totalFees = models.IntegerField(default=0)
    dateOfBirth = models.DateField(null=True)
    remark = models.TextField(null=True)

    # friendSection = models.ManyToManyField('class_app.Section')

    parentUser = models.ForeignKey(User, on_delete=models.PROTECT, default=0)

    # new student profile data
    motherName = models.TextField(null=True)
    gender = models.TextField(null=True)
    caste = models.TextField(null=True)

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
    address = models.TextField(null=True)
    familySSMID = models.IntegerField(null=True)
    childSSMID = models.IntegerField(null=True)
    bankName = models.TextField(null=True)
    bankAccountNum = models.TextField(null=True)
    aadharNum = models.IntegerField(null=True)
    bloodGroup = models.TextField(null=True)
    fatherAnnualIncome = models.TextField(null=True)

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

    def __str__(self):
        """A string representation of the model."""
        return self.parentUser.username+" --- "+self.name

    '''@property
    def currentRollNumber(self):
        return self.studentsection_set\
            .get(parentSection__parentClassSession__parentSession=get_current_session_object()).rollNumber'''

    def get_section_id(self, session_object):
        return self.studentsection_set\
            .get(parentSection__parentClassSession__parentSession=session_object).parentSection.id

    def get_section_name(self, session_object):
        return self.studentsection_set\
            .get(parentSection__parentClassSession__parentSession=session_object).parentSection.name

    def get_class_object(self, session_object):
        return self.studentsection_set.get(parentSection__parentClassSession__parentSession=session_object)\
            .parentSection.parentClassSession.parentClass

    def get_class_id(self, session_object):
        return self.studentsection_set\
            .get(parentSection__parentClassSession__parentSession=session_object).parentSection.parentClassSession.parentClass.id

    def get_class_name(self, session_object):
        try:
            return self.studentsection_set \
                .get(parentSection__parentClassSession__parentSession=session_object).parentSection.parentClassSession.parentClass.name
        except ObjectDoesNotExist:
            return None

    def get_rollNumber(self, session_object):
        return self.studentsection_set \
            .get(parentSection__parentClassSession__parentSession=session_object).rollNumber

    @property
    def school(self):
        return self.parentUser.school_set.filter()[0]

    @property
    def className(self):
        return self.studentsection_set\
            .get(parentSection__parentClassSession__parentSession=self.school.currentSession)\
            .parentSection.parentClassSession.parentClass.name

    class Meta:
        db_table = 'student'

# Create your models here.


class StudentSection(models.Model):

    parentStudent = models.ForeignKey(Student, on_delete=models.PROTECT, default=0, verbose_name='parentStudent')
    parentSection = models.ForeignKey(Section, on_delete=models.PROTECT, default=0, verbose_name='parentSection')
    rollNumber = models.TextField(null=True)
    attendance = models.IntegerField(null=True)

    class Meta:
        db_table = 'student_section'
