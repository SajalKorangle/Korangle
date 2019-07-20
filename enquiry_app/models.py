from django.db import models

from class_app.models import Class
from school_app.model.models import School
from employee_app.models import Employee


class Enquiry(models.Model):

    # Student's Name
    studentName = models.CharField(max_length=100)

    # Father's Name
    enquirerName = models.CharField(max_length=100)

    # Enquiry Date
    dateOfEnquiry = models.DateField(null=False, auto_now_add=True, verbose_name='dateOfEnquiry')

    # Mobile Number
    mobileNumber = models.IntegerField(null=True)

    # Address
    address = models.TextField(null=True)

    # Remark
    remark = models.TextField(null=True)

    # Class Id
    parentClass = models.ForeignKey(Class, on_delete=models.PROTECT, default=0)

    # School Id
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0)

    # Employee Id
    parentEmployee = models.ForeignKey(Employee, on_delete=models.PROTECT, null=True)

    class Meta:
        db_table = 'enquiry'

