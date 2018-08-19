from django.db import models

# Create your models here.

from student_app.models import Student
from school_app.model.models import School
from class_app.models import Section
from django.contrib.auth.models import User


class StudentAttendance(models.Model):

    ABSENT_ATTENDANCE_STATUS = 'ABSENT'
    HOLIDAY_ATTENDANCE_STATUS = 'HOLIDAY'
    PRESENT_ATTENDANCE_STATUS = 'PRESENT'
    ATTENDANCE_STATUS = (
        (ABSENT_ATTENDANCE_STATUS, 'Absent'),
        (HOLIDAY_ATTENDANCE_STATUS, 'Holiday'),
    )

    parentStudent = models.ForeignKey(Student, on_delete=models.PROTECT,
                                      null=False, default=0, verbose_name='parentStudent')
    dateOfAttendance = models.DateField(null=False, auto_now_add=True, verbose_name='dateOfAttendance')
    status = models.CharField(max_length=10, choices=ATTENDANCE_STATUS, null=False, default=PRESENT_ATTENDANCE_STATUS)

    class Meta:

        db_table = 'student_attendance'

        unique_together = ('parentStudent', 'dateOfAttendance')


class AttendancePermission(models.Model):

    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT,
                                     null=False, default=0, verbose_name='parentSchool')
    parentUser = models.ForeignKey(User, on_delete=models.PROTECT, null=False, default=0, verbose_name='parentUser')
    parentSection = models.ForeignKey(Section, on_delete=models.PROTECT,
                                      null=False, default=0, verbose_name='parentSection')

    class Meta:

        db_table = 'attendance_permission'

        unique_together = ('parentSchool', 'parentUser', 'parentSection')
