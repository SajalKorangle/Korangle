from django.db import models

# Create your models here.
from subject_app.models import ClassSubject
from employee_app.models import Employee
from student_app.models import Student, StudentSection


class AccountInfo(models.Model):
    parentEmployee = models.ForeignKey(Employee, unique=True, on_delete=models.CASCADE)
    meetingNumber = models.BigIntegerField()
    passcode = models.CharField(max_length=10)
    meetingUrl = models.CharField(max_length=200, default="")



class OnlineClass(models.Model):
    parentClassSubject = models.ForeignKey(ClassSubject, on_delete=models.CASCADE)

    WEEKDAYS_CHOICES = (
        ('Sunday', 'Sunday'),
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday')
    )

    day = models.CharField(max_length=20, choices=WEEKDAYS_CHOICES)
    startTimeJSON = models.CharField(max_length=100)
    endTimeJSON = models.CharField(max_length=100)

    def __str__(self):
        return str(self.parentSchool.pk) + ' - ' + self.parentSchool.name


class RestrictedStudent(models.Model):
    parentStudent = models.ForeignKey(Student, unique=True, on_delete=models.CASCADE)


class StudentAttendance(models.Model):
    parentStudentSection = models.ForeignKey(StudentSection, on_delete=models.CASCADE)
    parentClassSubject = models.ForeignKey(ClassSubject, on_delete=models.CASCADE)
    dateTime = models.DateTimeField(auto_now_add=True, blank=True)
