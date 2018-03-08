from django.db import models

from school_app.models import Session

# Create your models here.

class Class(models.Model):
    name = models.TextField()
    orderNumber = models.IntegerField(default=0)

    def __str__(self):
        """A string representation of the model."""
        return self.parentBoard.name + " --- " + self.name

class ClassSession(models.Model):
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, default=0)
    parentClass = models.ForeignKey(Class, on_delete=models.PROTECT, default=0)

    def __str__(self):
        return str(self.parentSession.startDate) + ' --- ' + str(self.parentSession.endDate) + ' --- ' + self.parentClass.name

class Section(models.Model):
    name = models.TextField()
    parentClassSession = models.ForeignKey(ClassSession, on_delete=models.PROTECT, default=0)
    orderNumber = models.IntegerField(default=0)

    def __str__(self):
        """A string representation of the model."""
        return self.parentSessionClass.parentClass
