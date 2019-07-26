from django.db import models

from school_app.model.models import Session

# Create your models here.


class Class(models.Model):
    name = models.TextField()
    orderNumber = models.IntegerField(default=0)

    def __str__(self):
        """A string representation of the model."""
        return self.name

    class Meta:
        db_table = 'class'


class Division(models.Model):
    name = models.TextField()
    orderNumber = models.IntegerField(default=0)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'division'

