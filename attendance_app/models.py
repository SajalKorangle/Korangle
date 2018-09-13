from django.db import models

# Create your models here.

from employee_app.models import Employee
from student_app.models import Student
from school_app.model.models import School
from class_app.models import Section
from django.contrib.auth.models import User

ABSENT_ATTENDANCE_STATUS = 'ABSENT'
HOLIDAY_ATTENDANCE_STATUS = 'HOLIDAY'
PRESENT_ATTENDANCE_STATUS = 'PRESENT'
ATTENDANCE_STATUS = (
    (ABSENT_ATTENDANCE_STATUS, 'Absent'),
    (PRESENT_ATTENDANCE_STATUS, 'Present'),
    (HOLIDAY_ATTENDANCE_STATUS, 'Holiday'),
)


class EmployeeAttendance(models.Model):

    parentEmployee = models.ForeignKey(Employee, on_delete=models.PROTECT,
                                       null=False, default=0, verbose_name='parentEmployee')
    dateOfAttendance = models.DateField(null=False, verbose_name='dateOfAttendance', default='2011-01-01')
    status = models.CharField(max_length=10, choices=ATTENDANCE_STATUS, null=False, default=PRESENT_ATTENDANCE_STATUS)


class StudentAttendance(models.Model):

    parentStudent = models.ForeignKey(Student, on_delete=models.PROTECT,
                                      null=False, default=0, verbose_name='parentStudent')
    dateOfAttendance = models.DateField(null=False, verbose_name='dateOfAttendance', default='2011-01-01')
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
