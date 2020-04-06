from django.db import models

from student_app.models import Student
from school_app.model.models import Session



class StudentRemark(models.Model):

    remark = models.TextField(null=False, default='-', verbose_name='remark', blank=True)
    parentStudent = models.ForeignKey(Student, models.CASCADE, null=False, default=0, verbose_name='parentStudent', related_name='%(class)s_parent_student')
    parentSession = models.ForeignKey(Session, models.PROTECT, null=False, default=0, verbose_name='parentSession', related_name='%(class)s_parent_session')

    class Meta:
        unique_together = ('parentStudent', 'parentSession')
