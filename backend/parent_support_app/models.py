from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from employee_app.models import Employee
from student_app.models import Student
from notification_app.models import Notification

class Status(models.Model):

    # Status Name
    name = models.CharField(max_length = 20)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'complaint_status'


class ComplaintType(models.Model):

    # Complaint Type Name
    name = models.CharField(max_length = 20)

    # Default Complaint Text
    defaultText = models.TextField()

    # Default Complaint Status
    parentStatus_defaultStatus = models.ForeignKey(Status, on_delete = models.SET_NULL, null = True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'complaint_type'


class Complaint(models.Model):

    # Father or Creator
    parentEmployee = models.ForeignKey(Employee, on_delete = models.CASCADE)

    # Date Sent
    dateSent = models.DateTimeField(auto_now_add = True)

    # Complaint Type
    parentComplaintType = models.ForeignKey(ComplaintType, on_delete = models.CASCADE)

    # Child
    parentStudent = models.ForeignKey(Student, on_delete = models.CASCADE)

    # Contact Number
    mobileNumber = models.BigIntegerField(null = True)

    # Complaint Title
    title = models.CharField(max_length = 50)

    # Comments
    # It's an object of objects.

    # comment = {
    #     "sender's name": name,
    #     "comment": comment,
    #     "Date-Time: dateTime",
    # }
    commentList = models.JSONField()

    # Complaint Status
    parentStatus = models.ForeignKey(Status, on_delete = models.SET_NULL, null = True)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'complaint'


class StatusComplaintType(models.Model):

    # Parent Status
    parentStatus = models.ForeignKey(Status, on_delete = models.CASCADE)

    # Parent Complaint type
    parentComplaintType = models.ForeignKey(ComplaintType, on_delete = models.CASCADE)

    def __str__(self):
        return (self.parentStatus.name + " & " + self.parentComplaintType.name)

    class Meta:
        db_table = 'status_complaintType'


class EmployeeComplaintType(models.Model):

    # Parent Employee
    parentEmployee = models.ForeignKey(Employee, on_delete = models.CASCADE)

    # Parent Complaint type
    parentComplaintType = models.ForeignKey(ComplaintType, on_delete = models.CASCADE)

    # User Id
    # Need at a time of creating a notification.
    userId = models.IntegerField()

    def __str__(self):
        return (self.parentEmployee.name + " & " + self.parentComplaintType.name)

    class Meta:
        db_table = 'employee_complaintType'


@receiver(post_save, sender = EmployeeComplaintType)
def notify_employee(sender, instance, created, **kwargs):

    if created:
        notification = Notification()
        notification.content = "A new complaint of type " + instance.parentComplaintType.name + " is assigned to you. Kindly respond to it. "
        notification.SMSEventId = 0
        notification.parentUser = instance.userId
        notification.parentSchool = instance.parentEmployee.parentSchool
        notification.save()
