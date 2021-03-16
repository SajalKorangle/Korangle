from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import timedelta
# Create your models here.

ERROR_SOURCES = (
    ('REST_API_SOURCE', 'rest_api'),
    ('JAVASCRIPT_SOURCE', 'js_runtime'),
)

class Error(models.Model):

    user = models.ForeignKey(User, null=True)
    errorSource = models.CharField(max_length=50, choices=ERROR_SOURCES, null=False, blank=False, verbose_name='Error Source')
    url = models.TextField()
    description = models.TextField()
    prompt = models.CharField(max_length=250)
    fatal = models.BooleanField(default=False);
    dateTime = models.DateTimeField(verbose_name='Date Time', auto_now_add=True)

    class Meta:
        db_table = 'error'

    def __str__(self):
        return self.prompt + ' - ' + (self.dateTime.astimezone().strftime("%d/%m/%Y, %H:%M:%S"))