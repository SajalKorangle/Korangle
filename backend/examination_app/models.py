from django.db import models

# Create your models here.

from school_app.model.models import School, Session
from student_app.models import Student
from class_app.models import Class, Division
from subject_app.models import Subject, SubjectSecond, ExtraSubField


class MaximumMarksAllowed(models.Model):

    marks = models.PositiveIntegerField(null=False, unique=True, verbose_name='marks', default=1)
    orderNumber = models.IntegerField(null=False, default=0, verbose_name='marks')

    class Meta:
        db_table = 'maximum_marks_allowed'
        ordering = ['orderNumber']


class Grade(models.Model):

    parentMaximumMarksAllowed = models.ForeignKey(MaximumMarksAllowed, on_delete=models.PROTECT, null=False, verbose_name='parentMaximumMarksAllowed', default=0)
    maximumMarks = models.DecimalField(max_digits=6, decimal_places=1,null=False, verbose_name='maximumMarks', default=0)
    minimumMarks = models.DecimalField(max_digits=6, decimal_places=1,null=False, verbose_name='minimumMarks', default=0)

    GRADES = (
        ('A', 'A'),
        ('B', 'B'),
        ('C', 'C'),
        ('D', 'D'),
        ('E', 'E'),
    )
    value = models.CharField(max_length=1, choices=GRADES, null=False, default='A')

    def __str__(self):

        return str(self.parentMaximumMarksAllowed.marks) + ',' + str(self.maximumMarks) + ', ' + str(self.minimumMarks) + ', ' + self.value

    class Meta:
        db_table = 'grade'
        ordering = ['value']
        unique_together = ('parentMaximumMarksAllowed', 'maximumMarks', 'minimumMarks')


class Test(models.Model):

    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, null=False, verbose_name='parentSchool', default=0)

    parentClass = models.ForeignKey(Class, on_delete=models.PROTECT, null=False, verbose_name='parentClass', default=0)
    parentDivision = models.ForeignKey(Division, on_delete=models.PROTECT, null=False, verbose_name='parentDivision', default=0)
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=False, verbose_name='parentSession', default=0)

    parentSubject = models.ForeignKey(Subject, on_delete=models.PROTECT, null=False, verbose_name='parentSubject', default=0)
    parentMaximumMarks = models.ForeignKey(MaximumMarksAllowed, on_delete=models.PROTECT, null=False, verbose_name='parentMaximumMarks', default=0)

    class Meta:
        db_table = 'test'
        ordering = ['parentSubject__orderNumber']
        unique_together = ('parentSchool', 'parentClass', 'parentDivision', 'parentSession', 'parentSubject')


class StudentTestResult(models.Model):

    parentStudent = models.ForeignKey(Student, on_delete=models.CASCADE, null=False, verbose_name='parentStudent', default=0)
    parentTest = models.ForeignKey(Test, on_delete=models.PROTECT, null=False, verbose_name='parentTest', default=0)
    marksObtained = models.DecimalField(max_digits=6, decimal_places=1,null=False, verbose_name='marksObtained', default=0)
    absent = models.BooleanField(default=False, verbose_name='absent')

    @property
    def subject(self):
        return self.parentTest.parentSubject

    @property
    def maximumMarks(self):
        return self.parentTest.parentMaximumMarks.marks

    @property
    def grade(self):
        maximumMarksAllowed_object = self.parentTest.parentMaximumMarks
        grade_object = Grade.objects.get(parentMaximumMarksAllowed=maximumMarksAllowed_object,
                                         maximumMarks__gte=self.marksObtained,
                                         minimumMarks__lte=self.marksObtained)
        return grade_object.value

    class Meta:
        db_table = 'student_test_result'
        ordering = ['parentTest__parentSubject__orderNumber']
        unique_together = ('parentStudent', 'parentTest')


EXAMINATION_STATUS = (
    ('Created', 'Created'),
    ('Declared', 'Declared'),
)


class Examination(models.Model):

    name = models.TextField(null=False, default='-', verbose_name='name')
    parentSchool = models.ForeignKey(School, models.PROTECT, null=False, default=0, verbose_name='parentSchool')
    parentSession = models.ForeignKey(Session, models.PROTECT, null=False, default=0, verbose_name='parentSession')
    status = models.CharField(max_length=20, choices=EXAMINATION_STATUS, null=False, default='Created', verbose_name='examinationStatus')

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'examination'
        unique_together = ('name', 'parentSchool', 'parentSession')


TEST_TYPE = (
    ('Oral', 'Oral'),
    ('Written', 'Written'),
    ('Theory', 'Theory'),
    ('Practical', 'Practical'),
)


class TestSecond(models.Model):

    parentExamination = models.ForeignKey(Examination, models.PROTECT, null=False, default=0, verbose_name='parentExamination')
    parentSubject = models.ForeignKey(SubjectSecond, models.PROTECT, null=False, default=0, verbose_name='parentSubject')
    parentClass = models.ForeignKey(Class, models.PROTECT, null=False, default=0, verbose_name='parentClass')
    parentDivision = models.ForeignKey(Division, models.PROTECT, null=False, default=0, verbose_name='parentDivision')
    startTime = models.DateTimeField(null=False, verbose_name='startTime')
    endTime = models.DateTimeField(null=False, verbose_name='endTime')
    testType = models.CharField(max_length=10, choices=TEST_TYPE, null=True, default=None, verbose_name='testType')
    maximumMarks = models.PositiveIntegerField(null=False, verbose_name='maximumMarks', default=100)

    class Meta:
        db_table = 'test_second'
        unique_together = ('parentExamination', 'parentSubject', 'parentClass', 'parentDivision', 'testType')


class StudentTest(models.Model):

    parentExamination = models.ForeignKey(Examination, models.PROTECT, null=False, default=0, verbose_name='parentExamination')
    parentSubject = models.ForeignKey(SubjectSecond, models.PROTECT, null=False, default=0, verbose_name='parentSubject')
    parentStudent = models.ForeignKey(Student, models.CASCADE, null=False, default=0, verbose_name='parentStudent')
    testType = models.CharField(max_length=10, choices=TEST_TYPE, null=True, default=None, verbose_name='testType')
    marksObtained = models.DecimalField(max_digits=6, decimal_places=1,null=False, verbose_name='marksObtained', default=0)

    class Meta:
        db_table = 'student_test'
        unique_together = ('parentExamination', 'parentSubject', 'parentStudent', 'testType')


class StudentExtraSubField(models.Model):

    parentExamination = models.ForeignKey(Examination, models.PROTECT, null=False, default=0, verbose_name='parentExamination')
    parentExtraSubField = models.ForeignKey(ExtraSubField, models.PROTECT, null=False, default=0, verbose_name='parentExtraSubField')
    parentStudent = models.ForeignKey(Student, models.CASCADE, null=False, default=0, verbose_name='parentStudent')
    marksObtained = models.DecimalField(max_digits=6, decimal_places=2, null=False, verbose_name='marksObtained', default=0)

    class Meta:
        db_table = 'student_extra_sub_field'
        unique_together = ('parentExamination', 'parentExtraSubField', 'parentStudent')


REPORT_CARD_TYPE = (
    ('Classic', 'Classic'),
    ('Elegant', 'Elegant'),
    ('Comprehensive', 'Comprehensive'),
)


class MpBoardReportCardMapping(models.Model):

    parentSchool = models.ForeignKey(School, models.PROTECT, null=False, default=0, verbose_name='parentSchool')
    parentSession = models.ForeignKey(Session, models.PROTECT, null=False, default=0, verbose_name='parentSession')
    minimumDecimalPoints = models.IntegerField(default=0, verbose_name='minimumDecimalPoint')
    maximumDecimalPoints = models.IntegerField(default=1, verbose_name='maximumDecimalPoint')

    # July
    parentExaminationJuly = models.ForeignKey(Examination, models.PROTECT, related_name='%(class)s_july', null=True, verbose_name='parentExaminationJuly')
    attendanceJulyStart = models.DateField(null=True, verbose_name='attendanceJulyStart')
    attendanceJulyEnd = models.DateField(null=True, verbose_name='attendanceJulyEnd')

    # August
    parentExaminationAugust = models.ForeignKey(Examination, models.PROTECT, related_name='%(class)s_august', null=True, default=0, verbose_name='parentExaminationAugust')
    attendanceAugustStart = models.DateField(null=True, verbose_name='attendanceAugustStart')
    attendanceAugustEnd = models.DateField(null=True, verbose_name='attendanceAugustEnd')

    # September
    parentExaminationSeptember = models.ForeignKey(Examination, models.PROTECT, related_name='%(class)s_september', null=True, default=0, verbose_name='parentExaminationSeptember')
    attendanceSeptemberStart = models.DateField(null=True, verbose_name='attendanceSeptemberStart')
    attendanceSeptemberEnd = models.DateField(null=True, verbose_name='attendanceSeptemberEnd')

    # October
    parentExaminationOctober = models.ForeignKey(Examination, models.PROTECT, related_name='%(class)s_october', null=True, default=0, verbose_name='parentExaminationOctober')
    attendanceOctoberStart = models.DateField(null=True, verbose_name='attendanceOctoberStart')
    attendanceOctoberEnd = models.DateField(null=True, verbose_name='attendanceOctoberEnd')

    # Half Yearly
    parentExaminationHalfYearly = models.ForeignKey(Examination, models.PROTECT, related_name='%(class)s_half_yearly', null=True, default=0, verbose_name='parentExaminationHalfYearly')
    attendanceHalfYearlyStart = models.DateField(null=True, verbose_name='attendanceHalfYearlyStart')
    attendanceHalfYearlyEnd = models.DateField(null=True, verbose_name='attendanceHalfYearlyEnd')

    # December
    parentExaminationDecember = models.ForeignKey(Examination, models.PROTECT, related_name='%(class)s_december', null=True, default=0, verbose_name='parentExaminationDecember')
    attendanceDecemberStart = models.DateField(null=True, verbose_name='attendanceDecemberStart')
    attendanceDecemberEnd = models.DateField(null=True, verbose_name='attendanceDecemberEnd')

    # January
    parentExaminationJanuary = models.ForeignKey(Examination, models.PROTECT, related_name='%(class)s_january', null=True, default=0, verbose_name='parentExaminationJanuary')
    attendanceJanuaryStart = models.DateField(null=True, verbose_name='attendanceJanuaryStart')
    attendanceJanuaryEnd = models.DateField(null=True, verbose_name='attendanceJanuaryEnd')

    # February
    parentExaminationFebruary = models.ForeignKey(Examination, models.PROTECT, related_name='%(class)s_february', null=True, default=0, verbose_name='parentExaminationFebruary')
    attendanceFebruaryStart = models.DateField(null=True, verbose_name='attendanceFebruaryStart')
    attendanceFebruaryEnd = models.DateField(null=True, verbose_name='attendanceFebruaryEnd')

    # Final
    parentExaminationFinal = models.ForeignKey(Examination, models.PROTECT, related_name='%(class)s_final', null=True, default=0, verbose_name='parentExaminationFinal')
    attendanceFinalStart = models.DateField(null=True, verbose_name='attendanceFinalStart')
    attendanceFinalEnd = models.DateField(null=True, verbose_name='attendanceFinalEnd')

    # Quarterly
    parentExaminationQuarterlyHigh = models.ForeignKey(Examination, models.PROTECT, related_name='%(class)s_quarterly_high', null=True, default=0, verbose_name='parentExaminationQuarterlyHigh')
    attendanceQuarterlyHighStart = models.DateField(null=True, verbose_name='attendanceQuarterlyHighStart')
    attendanceQuarterlyHighEnd = models.DateField(null=True, verbose_name='attendanceQuarterlyHighEnd')

    # HalfYearlyHigh
    parentExaminationHalfYearlyHigh = models.ForeignKey(Examination, models.PROTECT, related_name='%(class)s_half_yearly_high', null=True, default=0, verbose_name='parentExaminationHalfYearlyHigh')
    attendanceHalfYearlyHighStart = models.DateField(null=True, verbose_name='attendanceHalfYearlyHighStart')
    attendanceHalfYearlyHighEnd = models.DateField(null=True, verbose_name='attendanceHalfYearlyHighEnd')

    # FinalHigh
    parentExaminationFinalHigh = models.ForeignKey(Examination, models.PROTECT, related_name='%(class)s_final_high', null=True, default=0, verbose_name='parentExaminationFinalHigh')
    attendanceFinalHighStart = models.DateField(null=True, verbose_name='attendanceFinalHighStart')
    attendanceFinalHighEnd = models.DateField(null=True, verbose_name='attendanceFinalHighEnd')

    parentExaminationProject = models.ForeignKey(Examination, models.PROTECT, related_name='%(class)s_project', null=True, default=0, verbose_name='parentExaminationProject')

    reportCardType = models.CharField(max_length=20, choices=REPORT_CARD_TYPE, null=True, default=None, verbose_name='reportCardType')

    autoAttendance = models.BooleanField(null=False, default=True, verbose_name='autoAttendance')

    class Meta:
        db_table = 'mp_board_report_card_mapping'
        unique_together = ('parentSchool', 'parentSession')


class CCEMarks(models.Model):

    parentStudent = models.ForeignKey(Student, models.CASCADE, null=False, default=0, verbose_name='parentStudent')
    parentSession = models.ForeignKey(Session, models.PROTECT, null=False, default=0, verbose_name='parentSession')
    marksObtained = models.DecimalField(max_digits=6, decimal_places=1,null=False, verbose_name='marksObtained', default=0)

    class Meta:
        db_table = 'cce_marks'
        unique_together = ('parentStudent', 'parentSession')


