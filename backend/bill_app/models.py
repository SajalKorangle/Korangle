from django.db import models

# Other Model importing Starts

from school_app.model.models import School

# Other Model importing Ends

from common.common import BasePermission

# Create your models here.


# At first bills will only be added manually. It will not contain the payment information of sms or anything else.
class Bill(models.Model):

    parentSchool = models.ForeignKey(School, related_name='schoolList') # Bill will be paid by this school.
    amount = models.PositiveIntegerField(default=1) # Amount which needs to be paid.
    generationDateTime = models.DateTimeField(auto_now_add=True) # When the bill was added through django admin panel.
    dueDate = models.DateField(null=True) # When the bill is due.

    # When someone is late in paying the bill, but we do not want to suspend their usage yet.
    gracePeriod = models.IntegerField(default=0)

    # To keep the record whether the bill is paid or not. Can be updated by software or manually both.
    paid = models.BooleanField(default=False)

    # To keep the record when the bill was paid. Can be updated by software or manually both.
    paidDate = models.DateTimeField(null=True)

    # Any Extra information attached to bill
    remark = models.TextField(null=True)

    # To keep the pdf of bill
    billPDF = models.FileField()

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool_id']
        RelationsToStudent = []

    class Meta:
        db_table = 'bill'

