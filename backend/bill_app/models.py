from django.db import models

# Other Model importing Starts

from school_app.model.models import School
from payment_app.models import Order

# Other Model importing Ends

from common.common import BasePermission

# Create your models here.


# At first bills will only be added manually. It will not contain the payment information of sms or anything else.
class Bill(models.Model):

    parentSchool = models.ForeignKey(School, related_name='schoolList') # Bill will be paid by this school.
    amount = models.PositiveIntegerField(default=1) # Amount which needs to be paid.

    # When the bill was added through django admin panel.
    # Will not be shown to school in list, but will be shown in bill PDF.
    generationDateTime = models.DateTimeField(auto_now_add=True)

    dueDate = models.DateField(null=True) # When the bill is due.

    # If the bill is not paid then after this date at regular specified intervals,
    # software will send sms automatically to assign task employees.
    # I think the sms content should clearly mention the due date and suspension date and should ask the person
    # to contact sales support if for any extension or clarification.
    smsDate = models.DateField(null=True)
    smsIntervalDays = models.IntegerField(null=True)

    # If the bill is not paid then after this date,
    # software will show modal automatically to all employees.
    modalDate = models.DateField(null=True)

    # If the bill is not paid then after this date,
    # software will suspend school automatically for all employees and parents.
    suspensionDate = models.DateField(null=True)

    # For some reason a bill is cancelled, but you still want to keep the data.
    cancelledDate = models.DateField(null=True)

    # Order generated by client in lieu of bill.
    parentOrder = models.ForeignKey(Order, null=True, related_name='orderList')

    # To keep the record when the bill was paid.
    # Can be updated by software or manually both.
    paidDate = models.DateTimeField(null=True)

    # Any Extra information attached with the bill, to be shown in the list.
    remark = models.TextField(null=True)

    # To keep the pdf of bill
    billPDF = models.FileField()

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool_id']
        RelationsToStudent = []

    class Meta:
        db_table = 'bill'


class BillOrder(models.Model):

    parentBill = models.ForeignKey(Bill, default=0)
    parentOrder = models.ForeignKey(Order, default=0)

    class Permissions(BasePermission):
        RelationsToSchool = ['parentBill__parentSchool_id']
        RelationsToStudent = []

    class Meta:
        db_table = 'BillOrder'

