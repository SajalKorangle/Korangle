from django.db import models

# Create your models here.
from school_app.model.models import School
from django.contrib.auth.models import User

MESSAGE_TYPE = (
    ('Custom', 'Custom'),
    ('Defaulter', 'Defaulter'),
    ('Attendance', 'Attendance'),
    ('Fees', 'Fees'),
    ('Examination', 'Examination')
)

class Notification(models.Model):

    # Content
    content = models.TextField(null=False, default='', verbose_name='content')

    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPE, default='Custom')

    # Sent Date & Time
    sentDateTime = models.DateTimeField(null=False, auto_now_add=True, verbose_name='sentDateTime')

    # User
    parentUser = models.ForeignKey(User, on_delete=models.PROTECT, default=0, verbose_name='parentUser')

    # School
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, null=True, verbose_name='parentSchool')

    def __str__(self):
        return str(self.parentSchool.pk) + ' - ' + self.parentSchool.name

    class Meta:
        db_table = 'notification'


