from django.db import models

import os
from django.utils.timezone import now


from django.contrib.auth import get_user_model
User = get_user_model()
# Create your models here.


class Feature(models.Model):

    parentUser = models.ForeignKey(User, on_delete=models.CASCADE, default=0, verbose_name='parentUser')
    generationDateTime = models.DateTimeField(null=False, auto_now_add=True, verbose_name='generationDateTime')

    title = models.TextField(null=False)
    description = models.TextField(null=False)
    advantage = models.TextField(null=True, blank=True)
    frequency = models.TextField(null=True, blank=True)
    managedBy = models.TextField(null=True, blank=True)

    Resolved = 'Resolved'
    Rejected = 'Rejected'
    Pending = 'Pending'
    STATUS = (
        (Resolved, 'Resolved'),
        (Rejected, 'Rejected'),
        (Pending, 'Pending')
    )
    status = models.CharField(max_length=15, choices=STATUS, null=False, default=Pending)

    productManagerRemark = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'feature'

    def __str__(self):
        return str(self.parentUser.username) + ' - ' + self.title

