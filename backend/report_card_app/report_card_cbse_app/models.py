
from django.db import models

from student_app.models import Student
from school_app.model.models import Session, School
from examination_app.models import Examination


GRADE = (
    ('A', 'A'),
    ('B', 'B'),
    ('C', 'C'),
    ('D', 'D'),
    ('E', 'E'),
)


class Term(models.Model):

    name = models.TextField(null=False, default='-', verbose_name='name')

    def __str__(self):
        return self.name


class ExtraField(models.Model):

    name = models.TextField(null=False, default='-', verbose_name='name')

    def __str__(self):
        return self.name


class StudentExtraField(models.Model):

    parentTerm = models.ForeignKey(Term, models.PROTECT, null=False, default=0, verbose_name='parentTerm')
    parentExtraField = models.ForeignKey(ExtraField, models.PROTECT, null=False, default=0, verbose_name='parentExtraField')
    parentSession = models.ForeignKey(Session, models.PROTECT, null=False, default=0, verbose_name='parentSession')
    parentStudent = models.ForeignKey(Student, models.CASCADE, null=False, default=0, verbose_name='parentStudent')
    grade = models.CharField(max_length=2, choices=GRADE, null=False, default='A', verbose_name='grade')

    class Meta:
        unique_together = ('parentExtraField', 'parentStudent', 'parentTerm', 'parentSession')


class StudentRemark(models.Model):

    remark = models.TextField(null=False, default='-', verbose_name='remark', blank=True)
    parentStudent = models.ForeignKey(Student, models.CASCADE, null=False, default=0, verbose_name='parentStudent')
    parentSession = models.ForeignKey(Session, models.PROTECT, null=False, default=0, verbose_name='parentSession')

    class Meta:
        unique_together = ('parentStudent', 'parentSession')


class ReportCardMapping(models.Model):

    parentTerm = models.ForeignKey(Term, models.PROTECT, null=False, default=0, verbose_name='parentTerm')
    parentSession = models.ForeignKey(Session, models.PROTECT, null=False, default=0, verbose_name='parentSession')
    parentSchool = models.ForeignKey(School, models.PROTECT, null=False, default=0, verbose_name='parentSchool')

    parentExaminationPeriodicTest = models.ForeignKey(Examination, models.PROTECT, related_name='%(class)s_periodic_test', null=True, verbose_name='parentExaminationPeriodicTest')
    parentExaminationNoteBook = models.ForeignKey(Examination, models.PROTECT, related_name='%(class)s_note_book', null=True, verbose_name='parentExaminationNoteBook')
    parentExaminationSubEnrichment = models.ForeignKey(Examination, models.PROTECT, related_name='%(class)s_sub_enrichment', null=True, verbose_name='parentExaminationSubEnrichment')
    parentExaminationFinalTerm = models.ForeignKey(Examination, models.PROTECT, related_name='%(class)s_final_term', null=True, verbose_name='parentExaminationFinalTerm')

    attendanceStartDate = models.DateField(null=True, verbose_name='attendanceStartDate')
    attendanceEndDate = models.DateField(null=True, verbose_name='attendanceEndDate')

    class Meta:
        unique_together = ('parentSchool', 'parentSession', 'parentTerm')



