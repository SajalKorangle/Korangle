from django.db import models

# Create your models here.
from school_app.model.models import School
from subject_app.models import ClassSubject
from employee_app.models import Employee
from student_app.models import Student


class AccountInfo(models.Model):
    parentEmployee = models.ForeignKey(Employee, unique=True, on_delete=models.CASCADE)
    username = models.CharField(max_length=150)
    password = models.CharField(max_length=150)


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
    meetingNumber = models.BigIntegerField(blank=True, null=True)
    password = models.CharField(max_length=10, blank=True, null=True)
    startTimeJSON = models.CharField(max_length=100)
    endTimeJSON = models.CharField(max_length=100)

    def __str__(self):
        return str(self.parentSchool.pk) + ' - ' + self.parentSchool.name


class RestrictedStudent(models.Model):
    parentStudent = models.ForeignKey(Student, unique=True, on_delete=models.CASCADE)
