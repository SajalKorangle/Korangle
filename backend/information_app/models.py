from django.db import models

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

class SentUpdateType(models.Model):

    """
    1 - NULL
    2 - SMS
    3 - NOTIFICATION
    4 - NOTIF./SMS
    """

    name = models.CharField(max_length=40)

    def __str__(self):
        return self.name