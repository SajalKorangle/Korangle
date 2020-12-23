from django.db import models

# Create your models here.

from employee_app.models import Employee
from student_app.models import Student
from school_app.model.models import School, Session
from class_app.models import Division, Class
from django.contrib.auth.models import User

ABSENT_ATTENDANCE_STATUS = 'ABSENT'
HOLIDAY_ATTENDANCE_STATUS = 'HOLIDAY'
PRESENT_ATTENDANCE_STATUS = 'PRESENT'
HALF_DAY_ATTENDANCE_STATUS = 'HALF_DAY'
ATTENDANCE_STATUS = (
    (ABSENT_ATTENDANCE_STATUS, 'Absent'),
    (PRESENT_ATTENDANCE_STATUS, 'Present'),
    (HOLIDAY_ATTENDANCE_STATUS, 'Holiday'),
    (HALF_DAY_ATTENDANCE_STATUS, 'Half Day'),
)


class EmployeeAttendance(models.Model):

    parentEmployee = models.ForeignKey(Employee, on_delete=models.CASCADE,
                                       null=False, default=0, verbose_name='parentEmployee')
    dateOfAttendance = models.DateField(null=False, verbose_name='dateOfAttendance', default='2011-01-01')
    status = models.CharField(max_length=10, choices=ATTENDANCE_STATUS, null=False, default=PRESENT_ATTENDANCE_STATUS)

    class Meta:

        db_table = 'employee_attendance'
        unique_together = ('parentEmployee', 'dateOfAttendance')


class StudentAttendance(models.Model):

    parentStudent = models.ForeignKey(Student, on_delete=models.CASCADE,
                                      null=False, default=0, verbose_name='parentStudent')
    dateOfAttendance = models.DateField(null=False, verbose_name='dateOfAttendance', default='2011-01-01')
    status = models.CharField(max_length=10, choices=ATTENDANCE_STATUS, null=False, default=PRESENT_ATTENDANCE_STATUS)

    class Meta:

        db_table = 'student_attendance'
        unique_together = ('parentStudent', 'dateOfAttendance')


PENDING_LEAVE_STATUS = 'PENDING'
APPROVED_LEAVE_STATUS = 'APPROVED'
CANCELED_LEAVE_STATUS = 'CANCELED'
LEAVE_STATUS = (
    (PENDING_LEAVE_STATUS, 'Pending'),
    (APPROVED_LEAVE_STATUS, 'Approved'),
    (CANCELED_LEAVE_STATUS, 'Canceled'),
)


class EmployeeAppliedLeave(models.Model):

    parentEmployee = models.ForeignKey(Employee, on_delete=models.CASCADE,
                                       null=False, default=0, verbose_name='parentEmployee')
    dateOfLeave = models.DateField(null=False, verbose_name='dateOfLeave', default='2011-01-01')
    status = models.CharField(max_length=10, choices=LEAVE_STATUS, null=False, default=PENDING_LEAVE_STATUS)
    halfDay = models.BooleanField(null=False, default=False, verbose_name='halfDay')
    paidLeave = models.BooleanField(null=False, default=True, verbose_name='paidLeave')

    class Meta:

        db_table = 'employee_applied_leave'
        unique_together = ('parentEmployee', 'dateOfLeave')


class AttendancePermission(models.Model):

    parentEmployee = models.ForeignKey(Employee, on_delete=models.CASCADE, null=False, default=0, verbose_name='parentEmployee')

    parentDivision = models.ForeignKey(Division, on_delete=models.PROTECT,
                                       null=False, default=0, verbose_name='parentDivision')
    parentClass = models.ForeignKey(Class, on_delete=models.PROTECT,
                                    null=False, default=0, verbose_name='parentClass')
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT,
                                      null=False, default=0, verbose_name='parentSession')

    class Meta:

        db_table = 'attendance_permission'
        unique_together = ('parentEmployee', 'parentDivision', 'parentClass', 'parentSession')

#setting_page_model

class AttendanceSettings(models.Model):

    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0, verbose_name='parentSchool')

    SMS_UPDATE = 'SMS'
    NOTIFICATION_UPDATE = 'NOTIFICATION'
    NOTIFSMS_UPDATE = 'NOTIF./SMS'
    NO_UPDATE = 'NULL'
    SENTUPDATE_CHOICES = [
        (SMS_UPDATE, 'SMS'),
        (NOTIFICATION_UPDATE, 'NOTIFICATION'),
        (NOTIFSMS_UPDATE, 'NOTIF./SMS'),
        (NO_UPDATE, 'NULL')
    ]

    sentUpdateType = models.CharField(max_length=20, choices=SENTUPDATE_CHOICES, null=False, default=NO_UPDATE, verbose_name='sentUpdateType')

    UPDATE_ALL = 'All Students'
    UPDATE_ABSENT = 'Only Absent Students'
    UPDATETO_CHOICES = [
        (UPDATE_ALL, 'All Students'),
        (UPDATE_ABSENT, 'Only Absent Students')
    ]

    receiverType = models.CharField(max_length=20, choices=UPDATETO_CHOICES, null=False, default=UPDATE_ALL, verbose_name='')

    class Meta:
        db_table = 'attendance_settings'
