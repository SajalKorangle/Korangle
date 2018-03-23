from django.db import models

# Create your models here.

class Subject(models.Model):

    name = models.TextField(null=False, default='', verbose_name='name', unique=True)
    orderNumber = models.IntegerField(null=False, default=0, verbose_name='orderNumber')
    governmentSubject = models.BooleanField(null=False, default=True, verbose_name='governmentSubject')

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'subject'
        ordering = ['orderNumber']
