from django.db import models

from school_app.model.models import School

# Deprecated Model (Do Not Use it)
class MessageType(models.Model):
    """
    1 - General
    2 - Defaulter
    3 - Fee Receipt
    4 - Attendance
    """
    name = models.CharField(max_length=40)

    def __str__(self):
        return self.name

class AdminInformation(models.Model):

    # School
    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE, default=0, verbose_name='parentSchool')

    # Content
    content = models.TextField(null=False, default='', verbose_name='content')

    # Sent Date & Time
    sentDateTime = models.DateTimeField(null=False, auto_now_add=True, verbose_name='sentDateTime')

    # SMS Count
    smsCount = models.IntegerField(null=False, default=0, verbose_name='smsCount')

    # Notification Count
    notificationCount = models.IntegerField(null=False, default=0, verbose_name='notificationCount')

    # Employee List
    employeeList = models.TextField(null=False, default='', verbose_name='employeeList')

    def __str__(self):
        return str(self.parentSchool.pk) + ' - ' + self.parentSchool.name + ' --- ' + str(self.smsCount) + ' / ' + str(self.notificationCount)

    class Meta:
        db_table = 'admin_information'