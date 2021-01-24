from django.db import models

# Create your models here.

ERROR_SOURCES = (
    ('REST_API_SOURCE', 'rest_api'),
    ('JAVASCRIPT_SOURCE', 'js_runtime'),
)

class Error(models.Model):

    errorSource = models.CharField(max_length=50, choices=ERROR_SOURCES, null=False, blank=False)
    url = models.CharField(max_length=200, null=False, blank=False)
    description = models.TextField()
    prompt = models.CharField(max_length=200)
    fatal = models.BooleanField(default=False);

    class Meta:
        db_table = 'error'