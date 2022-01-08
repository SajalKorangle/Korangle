from django.db import models
from django.contrib.postgres.fields import ArrayField

from employee_app.models import Employee
from student_app.models import Student

# Create your models here.
class MessageType(models.Model):

    # Type Name
    name = models.CharField(max_length = 20)

    # Default Text
    defaultText = models.TextField()

    # Higher Authorities
    higherAuthoritiesDetail = models.JSONField()

    # Applicable Status
    statuses = ArrayField(models.CharField(max_length=20))

    # Default Status
    defaultStatus = models.CharField(max_length = 20)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'message_type'


class Message(models.Model):

    # Parent Name
    parentEmployee = models.ForeignKey(Employee, on_delete=models.CASCADE)

    # Date Sent
    dateSent = models.DateTimeField(auto_now_add = True)

    # Message Type
    parentMessageType = models.ForeignKey(MessageType, on_delete=models.CASCADE)

    # Child Name
    parentStudent = models.ForeignKey(Student, on_delete=models.CASCADE)

    # Contact Number
    mobileNumber = models.BigIntegerField(null=True)

    # Title
    title = models.CharField(max_length = 50)

    # Comments
    comments = models.JSONField()

    # Message Status
    status = models.CharField(max_length = 20)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'message'


class EmployeeMessageTypeJuction(models.Model):

    parentEmployee = models.ForeignKey(Employee, on_delete=models.CASCADE)

    parentMessageType = models.ForeignKey(MessageType, on_delete=models.CASCADE)

    def __str__(self):
        return (self.parentEmployee.name + " & " + self.parentMessageType.name)

    class Meta:
        db_table = 'employee_messageType_junction'
