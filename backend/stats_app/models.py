from django.db import models
from school_app.model.models import School


class APIResponse(models.Model):
    parentSchool = models.ForeignKey(School, blank=True, null=True)
    path = models.CharField(max_length=320)
    method = models.CharField(max_length=10)
    queryString = models.TextField(blank=True, null=True)
    responseSize = models.PositiveIntegerField()
    responseTime = models.FloatField()
    dateTime = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return '{0} | Response Time: {1} | Size: {2} : {3}'.format(self.path, self.responseTime, self.responseSize, self.dateTime)
