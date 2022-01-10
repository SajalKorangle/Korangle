from django.db import models

from employee_app.models import Employee
from student_app.models import Student


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
    defaultStatus = models.CharField(max_length = 20)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'complaint_type'


class Complaint(models.Model):

    # Parent Name
    parentEmployee = models.ForeignKey(Employee, on_delete=models.CASCADE)

    # Date Sent
    dateSent = models.DateTimeField(auto_now_add = True)

    # Complaint Type
    parentComplaintType = models.ForeignKey(ComplaintType, on_delete=models.CASCADE)

    # Child
    parentStudent = models.ForeignKey(Student, on_delete=models.CASCADE)

    # Contact Number
    mobileNumber = models.BigIntegerField(null=True)

    # Complaint Title
    title = models.CharField(max_length = 50)

    # Comments
    # It's an object of objects.

    # comment = {
    #     "sender's name": name,
    #     "comment": comment,
    #     "Date-Time: dateTime",
    # }
    comments = models.JSONField()

    # Complaint Status
    status = models.ForeignKey(Status, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'complaint'


class StatusComplaintTypeJunction(models.Model):

    # Parent Status
    parentStatus = models.ForeignKey(Status, on_delete=models.CASCADE)

    # Parent Complaint type
    parentComplaintType = models.ForeignKey(ComplaintType, on_delete=models.CASCADE)

    def __str__(self):
        return (self.parentStatus.name + " & " + self.parentComplaintType.name)

    class Meta:
        db_table = 'status_complaintType_junction'


class EmployeeMessageTypeJuction(models.Model):

    # Parent Employee
    parentEmployee = models.ForeignKey(Employee, on_delete=models.CASCADE)

    # Parent Complaint type
    parentComplaintType = models.ForeignKey(ComplaintType, on_delete=models.CASCADE)

    # Notify employee based on complaint's status
    notifyStatus = models.CharField(max_length = 20, null = True)

    # After how many day he/she should get notified
    notifyDays = models.IntegerField(null = True)

    def __str__(self):
        return (self.parentEmployee.name + " & " + self.parentComplaintType.name)

    class Meta:
        db_table = 'employee_complaintType_junction'
