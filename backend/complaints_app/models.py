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


class SchoolComplaintStatus(models.Model):

    # Status Name
    name = models.CharField(max_length = 100)

    # Parent School
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']

    class Meta:
        db_table = 'school_complaint_status'


class SchoolComplaintType(models.Model):

    # Complaint Type Name
    name = models.CharField(max_length = 100)

    # Default Complaint Text
    defaultText = models.TextField()

    # Default Complaint Status
    parentSchoolComplaintStatusDefault = models.ForeignKey(SchoolComplaintStatus, on_delete = models.SET_NULL, null = True)

    # Parent School
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']

    class Meta:
        db_table = 'school_complaint_type'


class Complaint(models.Model):

    # Creator (Employee)
    # It will be null for the parent, who is not an employee of the school.
    # This would be required if the complaint is raised by the employee of the school.
    parentEmployee = models.ForeignKey(Employee, on_delete = models.SET_NULL, null = True)

    # Date Sent
    dateSent = models.DateTimeField(auto_now_add = True)

    # Complaint Type
    parentSchoolComplaintType = models.ForeignKey(SchoolComplaintType, on_delete = models.SET_NULL, null = True)

    # Child
    parentStudent = models.ForeignKey(Student, on_delete = models.CASCADE)

    # Complaint Title
    title = models.CharField(max_length = 100)

    # Complaint Status
    parentSchoolComplaintStatus = models.ForeignKey(SchoolComplaintStatus, on_delete = models.SET_NULL, null = True)

    # Parent School
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']

    class Meta:
        db_table = 'complaint'


@receiver(post_save, sender = Complaint)
def notify_parents_on_complaint(sender, instance, created, **kwargs):

    if created and instance.parentEmployee:

        senderEmployeeMobileNumber = ""
        senderEmployeeMobileNumber = str(instance.parentEmployee.mobileNumber)

        # Notify parents if their complaint is raised by a school employee.
        # 1. Using mobileNumber.
        mobileNumber = str(instance.parentStudent.mobileNumber)
        user = User.objects.filter(username = mobileNumber)

        # If the complaint is raised by parent, he/she should not get notified.
        if (len(user) > 0) and (senderEmployeeMobileNumber != mobileNumber):
            user = user[0]
            content = instance.parentEmployee.name + " has raised your complaint titled as " + instance.title + "."
            parentSchool = instance.parentStudent.parentSchool
            createNotification(content, user, parentSchool)


        # 2. Using secondMobileNumber.
        secondMobileNumber = str(instance.parentStudent.secondMobileNumber)
        user = User.objects.filter(username = secondMobileNumber)

        # If the complaint is raised by parent, he/she should not get notified.
        if (len(user) > 0) and (senderEmployeeMobileNumber != secondMobileNumber):
            user = user[0]
            content = instance.parentEmployee.name + " has raised your complaint titled as " + instance.title + "."
            parentSchool = instance.parentStudent.parentSchool
            createNotification(content, user, parentSchool)


@receiver(post_save, sender = Complaint)
def assign_employee_on_complaint(sender, instance, created, **kwargs):

    if created and instance.parentSchoolComplaintType:
        # Assign all employees whose parentSchoolComplaintType = instance.parentSchoolComplaintType.
        for employee_complaintType in EmployeeComplaintType.objects.filter(parentSchoolComplaintType = instance.parentSchoolComplaintType):
            employee_complaint = EmployeeComplaint()
            employee_complaint.parentEmployee = employee_complaintType.parentEmployee
            employee_complaint.parentComplaint = instance
            employee_complaint.save()


class Comment(models.Model):

    # If sender is employee.
    # parentEmployee would be null if the comment is posted by the parent.
    parentEmployee = models.ForeignKey(Employee, on_delete = models.SET_NULL, null = True)

    # We will fetch father's name && contact number from his child.
    parentStudent = models.ForeignKey(Student, on_delete = models.CASCADE)

    # Sender's message
    message = models.TextField()

    # Created At
    createdAt = models.DateTimeField(auto_now_add = True)

    # Parent Complaint
    parentComplaint = models.ForeignKey(Complaint, on_delete = models.CASCADE)

    def __str__(self):
        return self.message

    class Permissions(BasePermission):
        RelationsToSchool = ['parentStudent__parentSchool__id']

    class Meta:
        db_table = 'complaint_comment'


@receiver(post_save, sender = Comment)
def notify_on_comment(sender, instance, created, **kwargs):

    commentList = Comment.objects.filter(parentComplaint = instance.parentComplaint)
    if created and len(commentList) > 1:

        for employee_complaint in EmployeeComplaint.objects.filter(parentComplaint = instance.parentComplaint).exclude(parentEmployee = instance.parentEmployee):
            mobileNumber = str(employee_complaint.parentEmployee.mobileNumber)
            user = User.objects.filter(username = mobileNumber)

            # All complaint-authorities should get notified except who has answered to that complaint.
            if len(user) > 0:
                user = user[0]
                content = "A new comment has been added to the complaint titled as " + instance.parentComplaint.title + "."
                parentSchool = instance.parentStudent.parentSchool
                createNotification(content, user, parentSchool)


        if instance.parentEmployee:

            # Notify parents if a school employee has answered their complaint.
            # 1. Using mobileNumber.
            mobileNumber = str(instance.parentStudent.mobileNumber)
            user = User.objects.filter(username = mobileNumber)
            if len(user) > 0:
                user = user[0]
                content = instance.parentEmployee.name + " has answered your complaint titled as " + instance.parentComplaint.title + "."
                parentSchool = instance.parentStudent.parentSchool
                createNotification(content, user, parentSchool)

            # 2. Using secondMobileNumber.
            secondMobileNumber = str(instance.parentStudent.secondMobileNumber)
            user = User.objects.filter(username = secondMobileNumber)
            if len(user) > 0:
                user = user[0]
                content = instance.parentEmployee.name + " has answered your complaint titled as " + instance.parentComplaint.title + "."
                parentSchool = instance.parentStudent.parentSchool
                createNotification(content, user, parentSchool)


# StatusComplaintType database is used to store applicable-status-list of a complaintType.
class StatusComplaintType(models.Model):

    # Parent Status
    parentSchoolComplaintStatus = models.ForeignKey(SchoolComplaintStatus, on_delete = models.CASCADE)

    # Parent Complaint type
    parentSchoolComplaintType = models.ForeignKey(SchoolComplaintType, on_delete = models.CASCADE)

    def __str__(self):
        return (self.parentSchoolComplaintStatus.name + " & " + self.parentSchoolComplaintType.name)

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchoolComplaintType__parentSchool__id']

    class Meta:
        db_table = 'status_complaintType'


class EmployeeComplaintType(models.Model):

    # Parent Employee
    parentEmployee = models.ForeignKey(Employee, on_delete = models.CASCADE)

    # Parent Complaint type
    parentSchoolComplaintType = models.ForeignKey(SchoolComplaintType, on_delete = models.CASCADE)

    def __str__(self):
        return (self.parentEmployee.name + " & " + self.parentSchoolComplaintType.name)

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchoolComplaintType__parentSchool__id']

    class Meta:
        db_table = 'employee_complaintType'


class EmployeeComplaint(models.Model):

    # Parent Employee
    parentEmployee = models.ForeignKey(Employee, on_delete = models.CASCADE)

    # Parent Complaint
    parentComplaint = models.ForeignKey(Complaint, on_delete = models.CASCADE)

    def __str__(self):
        return (self.parentEmployee.name + " & " + self.parentComplaint.title)

    class Permissions(BasePermission):
        RelationsToSchool = ['parentEmployee__parentSchool__id']

    class Meta:
        db_table = 'employee_complaint'


@receiver(post_save, sender = EmployeeComplaint)
def notify_employee_on_complaint(sender, instance, created, **kwargs):

    if created:

        senderEmployeeMobileNumber = ""
        if instance.parentComplaint.parentEmployee:
            senderEmployeeMobileNumber = str(instance.parentComplaint.parentEmployee.mobileNumber)

        # Notify assigned employee of parentComplaint.
        mobileNumber = str(instance.parentEmployee.mobileNumber)
        user = User.objects.filter(username = mobileNumber)
        if (len(user) > 0) and (senderEmployeeMobileNumber != mobileNumber):
            user = user[0]
            content = "A new complaint titled as " + instance.parentComplaint.title + " has been assigned to you. Kindly respond to it."
            parentSchool = instance.parentComplaint.parentSchool
            createNotification(content, user, parentSchool)


class CountAllComplaints(models.Model):

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
