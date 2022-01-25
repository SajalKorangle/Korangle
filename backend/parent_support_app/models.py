from django.db import models
from common.common import BasePermission
from django.db.models.signals import post_save
from django.dispatch import receiver

from employee_app.models import Employee
from student_app.models import Student
from notification_app.models import Notification
from user_app.models import User
from school_app.model.models import School


def createNotification(content, parentUser, parentSchool):
    notification = Notification()
    notification.content = content
    notification.SMSEventId = 0
    notification.parentUser = parentUser
    notification.parentSchool = parentSchool
    notification.save()


class Status(models.Model):

    # Status Name
    name = models.CharField(max_length = 100)

    # Parent School
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']

    class Meta:
        db_table = 'complaint_status'


class ComplaintType(models.Model):

    # Complaint Type Name
    name = models.CharField(max_length = 100)

    # Default Complaint Text
    defaultText = models.TextField()

    # Default Complaint Status
    parentStatusDefault = models.ForeignKey(Status, on_delete = models.SET_NULL, null = True)

    # Parent School
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']

    class Meta:
        db_table = 'complaint_type'


class Complaint(models.Model):

    # Creator (Employee)
    # It will be null for the parent, who is not an employee of the school.
    # This would be required if the complaint is raised by the employee of the school.
    parentEmployee = models.ForeignKey(Employee, on_delete = models.CASCADE, null = True)

    # In the case of the parent, his employee id would be null.
    # So we have to use the User model to extract information related to the user.
    # It would require, while generating the notifications.
    # parentUser = models.ForeignKey(User, on_delete = models.CASCADE, null = True)

    # Date Sent
    dateSent = models.DateTimeField(auto_now_add = True)

    # Complaint Type
    parentComplaintType = models.ForeignKey(ComplaintType, on_delete = models.CASCADE)

    # Child
    parentStudent = models.ForeignKey(Student, on_delete = models.CASCADE)

    # Complaint Title
    title = models.CharField(max_length = 100)

    # Complaint Status
    parentStatus = models.ForeignKey(Status, on_delete = models.SET_NULL, null = True)

    # Parent School
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']

    class Meta:
        db_table = 'complaint'


@receiver(post_save, sender = Complaint)
def notify_on_complaint(sender, instance, created, **kwargs):

    if created:

        # Notify all the assigned employee of parentComplaintType.
        for employee_complaintType in EmployeeComplaintType.objects.filter(parentComplaintType = instance.parentComplaintType):
            mobileNumber = str(employee_complaintType.parentEmployee.mobileNumber)
            user = User.objects.filter(username = mobileNumber)
            if len(user) > 0:
                user = user[0]
                content = "A new complaint of type " + instance.parentComplaintType.name + " has been assigned to you. Kindly respond to it."
                parentSchool = instance.parentSchool
                createNotification(content, user, parentSchool)


        if instance.parentEmployee:

            # Notify parent employee on creation of complaint.
            mobileNumber = str(instance.parentEmployee.mobileNumber)
            user = User.objects.filter(username = mobileNumber)
            if len(user) > 0:
                user = user[0]
                content = "Your complaint titled as " + instance.title + " has been sent."
                parentSchool = instance.parentStudent.parentSchool
                createNotification(content, user, parentSchool)

            # Notify parent as employee has answered their complaint.
            mobileNumber = str(instance.parentStudent.mobileNumber)
            user = User.objects.filter(username = mobileNumber)
            if len(user) > 0:
                user = user[0]
                content = instance.parentEmployee.name + " has raised a complaint against your child" + instance.parentStudent.name + "."
                parentSchool = instance.parentStudent.parentSchool
                createNotification(content, user, parentSchool)

        else:

            # Notify parent on creation of comment.
            mobileNumber = str(instance.parentStudent.mobileNumber)
            user = User.objects.filter(username = mobileNumber)
            if len(user) > 0:
                user = user[0]
                content = "Your complaint titled as " + instance.title + " has been sent."
                parentSchool = instance.parentStudent.parentSchool
                createNotification(content, user, parentSchool)


class Comment(models.Model):

    # If sender is employee.
    parentEmployee = models.ForeignKey(Employee, on_delete = models.SET_NULL, null = True)

    # If sender is parent.
    # We will fetch father's name && contact number from his child.
    # It would be null, if the comment is made by school employee.
    parentStudent = models.ForeignKey(Student, on_delete = models.CASCADE, null = True)

    # Parent User
    # It would require, while generating the notifications.
    # parentUser = models.ForeignKey(User, on_delete = models.CASCADE, null = True)

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


@receiver(post_save, sender = Comment)
def notify_on_comment(sender, instance, created, **kwargs):

    commentList = Comment.objects.filter(parentComplaint = instance.parentComplaint)
    if created and len(commentList) > 1:
        print("Comment Created")

        # Notify all the assigned employee of parentComplaintType.
        for employee_complaintType in EmployeeComplaintType.objects.filter(parentComplaintType = instance.parentComplaint.parentComplaintType):
            mobileNumber = str(employee_complaintType.parentEmployee.mobileNumber)
            user = User.objects.filter(username = mobileNumber)
            if len(user) > 0:
                user = user[0]
                content = "A new comment has been added to the complaint titled as " + instance.parentComplaint.title + "."
                parentSchool = instance.parentStudent.parentSchool
                createNotification(content, user, parentSchool)


        if instance.parentEmployee:

            # Notify parent as employee has answered their complaint.
            mobileNumber = str(instance.parentStudent.mobileNumber)
            user = User.objects.filter(username = mobileNumber)
            if len(user) > 0:
                user = user[0]
                content = instance.parentEmployee.name + " has commented on complaint " + instance.parentComplaint.title + "."
                parentSchool = instance.parentStudent.parentSchool
                createNotification(content, user, parentSchool)

        if ((not instance.parentEmployee) and instance.parentComplaint.parentEmployee):

            # Notify parentEmployee on creation of comment.
            mobileNumber = str(instance.parentComplaint.parentEmployee.mobileNumber)
            user = User.objects.filter(username = mobileNumber)
            if len(user) > 0:
                user = user[0]
                content = instance.parentStudent.fathersName + "  father of " + instance.parentStudent.name + ", has commented on complaint " + instance.parentComplaint.title + "."
                parentSchool = instance.parentStudent.parentSchool
                createNotification(content, user, parentSchool)


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


class CountAllParentSupport(models.Model):

    # Table Name
    formatName = models.CharField(max_length = 100)

    # Parent School
    parentSchool = models.ForeignKey(School, on_delete = models.CASCADE)

    # It will store all the rows of the table in JSON format.
    rows = models.JSONField()

    # It will store all the columns of the table in JSON format.
    cols = models.JSONField()

    def __str__(self):
        return self.formatName

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']

    class Meta:
        db_table = 'count_all_parentSupport'
