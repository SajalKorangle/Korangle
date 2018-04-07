from django.db import models

# Create your models here.

from school_app.model.models import School
from student_app.models import Student
from class_app.models import Section
from subject_app.models import Subject

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
    parentSection = models.ForeignKey(Section, on_delete=models.PROTECT, null=False, verbose_name='parentSection', default=0)
    parentSubject = models.ForeignKey(Subject, on_delete=models.PROTECT, null=False, verbose_name='parentSubject', default=0)
    parentMaximumMarks = models.ForeignKey(MaximumMarksAllowed, on_delete=models.PROTECT, null=False, verbose_name='parentMaximumMarks', default=0)

    class Meta:
        db_table = 'test'
        ordering = ['parentSubject__orderNumber']
        unique_together = ('parentSchool', 'parentSection', 'parentSubject')

class StudentTestResult(models.Model):

    parentStudent = models.ForeignKey(Student, on_delete=models.PROTECT, null=False, verbose_name='parentStudent', default=0)
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

