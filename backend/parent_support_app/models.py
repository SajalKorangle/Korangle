from django.db import models
from common.common import BasePermission
from django.db.models.signals import post_save
from django.dispatch import receiver

from employee_app.models import Employee
from student_app.models import Student
from notification_app.models import Notification
from user_app.models import User
from school_app.model.models import School

class Status(models.Model):

    # Status Name
    name = models.CharField(max_length = 20)

    def __str__(self):
        return self.name

    class Permissions(BasePermission):
        pass

    class Meta:
        db_table = 'complaint_status'


class ComplaintType(models.Model):

    # Complaint Type Name
    name = models.CharField(max_length = 20)

    # Default Complaint Text
    defaultText = models.TextField()

    # Default Complaint Status
    parentStatusDefault = models.ForeignKey(Status, on_delete = models.SET_NULL, null = True)

    def __str__(self):
        return self.name

    class Permissions(BasePermission):
        pass

    class Meta:
        db_table = 'complaint_type'


class Complaint(models.Model):

    # Creator
    # It will be null for parent, who is not an emplyee of school. User model will used for parent.
    # This would require if the complaint is raised by the employee of the school.
    parentEmployee = models.ForeignKey(Employee, on_delete = models.CASCADE, null = True)

    # In case of parent, his employee id would null.
    # So we have to use User model to extract information related to user.
    parentUser = models.ForeignKey(User, on_delete = models.CASCADE, null = True)

    # Date Sent
    dateSent = models.DateTimeField(auto_now_add = True)

    # Complaint Type
    parentComplaintType = models.ForeignKey(ComplaintType, on_delete = models.CASCADE)

    # Child
    parentStudent = models.ForeignKey(Student, on_delete = models.CASCADE)

    # Complaint Title
    title = models.CharField(max_length = 50)

    # Complaint Status
    parentStatus = models.ForeignKey(Status, on_delete = models.SET_NULL, null = True, default = 0)

    def __str__(self):
        return self.title

    class Permissions(BasePermission):
        RelationsToSchool = ['parentEmployee__parentSchool__id']

    class Meta:
        db_table = 'complaint'


class Comment(models.Model):

    # Sender
    parentEmployee = models.ForeignKey(Employee, on_delete = models.SET_NULL, null = True)

    # If sender is parent.
    parentUser = models.ForeignKey(User, on_delete = models.CASCADE, null = True)

    # Sender's message
    message = models.TextField()

    # Created At
    createdAt = models.DateTimeField(auto_now_add = True)

    # Parent Complaint
    parentComplaint = models.ForeignKey(Complaint, on_delete = models.CASCADE)

    def __str__(self):
        return (self.parentEmployee.name + " & " + self.parentComplaint.title)

    class Permissions(BasePermission):
        RelationsToSchool = ['parentEmployee__parentSchool__id']

    class Meta:
        db_table = 'complaint_comment'


class StatusComplaintType(models.Model):

    # Parent Status
    parentStatus = models.ForeignKey(Status, on_delete = models.CASCADE)

    # Parent Complaint type
    parentComplaintType = models.ForeignKey(ComplaintType, on_delete = models.CASCADE)

    def __str__(self):
        return (self.parentStatus.name + " & " + self.parentComplaintType.name)

    class Permissions(BasePermission):
        pass

    class Meta:
        db_table = 'status_complaintType'


class EmployeeComplaintType(models.Model):

    # Parent Employee
    parentEmployee = models.ForeignKey(Employee, on_delete = models.CASCADE)

    # Parent Complaint type
    parentComplaintType = models.ForeignKey(ComplaintType, on_delete = models.CASCADE)

    def __str__(self):
        return (self.parentEmployee.name + " & " + self.parentComplaintType.name)

    class Permissions(BasePermission):
        RelationsToSchool = ['parentEmployee__parentSchool__id']

    class Meta:
        db_table = 'employee_complaintType'


class CountAllTable(models.Model):
    formatName = models.CharField(max_length=50)
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE, default=0)
    rows = models.JSONField()    # It will store all the rows of the table in JSON format.
    cols = models.JSONField()    # It will store all the columns of the table in JSON format.

    def __str__(self):
        return self.formatName

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']

    class Meta:
        db_table = 'count_all_table_parentSupport'


@receiver(post_save, sender = Complaint)
def notify_employee(sender, instance, created, **kwargs):

    if created:
        for employee_complaintType in EmployeeComplaintType.objects.filter(parentComplaintType = instance.parentComplaintType):
            notification = Notification()
            notification.content = "A new complaint of type " + instance.parentComplaintType.name + " is assigned to you. Kindly respond to it."
            notification.SMSEventId = 0
            notification.parentUser = instance.parentUser
            notification.parentSchool = employee_complaintType.parentEmployee.parentSchool
            notification.save()
