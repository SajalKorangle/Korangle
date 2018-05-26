from django.db import models

from school_app.model.models import School


class Employee(models.Model):

    # Name
    name = models.CharField(max_length=100)

    # Father's Name
    fatherName = models.CharField(max_length=100)

    # Mother's Name
    motherName = models.CharField(max_length=100, null=True)

    # Date of Birth
    dateOfBirth = models.DateField(null=True)

    # Gender
    gender = models.TextField(null=True)

    # Mobile Number
    mobileNumber = models.IntegerField(null=True)

    # Address
    address = models.TextField(null=True)

    # Aadhar No.
    aadharNumber = models.IntegerField(null=True)

    # Passport No.
    passportNumber = models.TextField(null=True)

    # Qualification
    qualification = models.TextField(null=True)

    # Employee No.
    employeeNumber = models.TextField(null=True)

    # Post
    currentPost = models.TextField(null=True)

    # Joining Date
    dateOfJoining = models.DateField(null=True)

    # Bank Name
    bankName = models.TextField(null=True)

    # Bank Account Number
    bankAccountNumber = models.TextField(null=True)

    # EPF Account No.
    epfAccountNumber = models.TextField(null=True)

    # Pan No.
    panNumber = models.TextField(null=True)

    # Remark
    remark = models.TextField(null=True)

    # School Id
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0)

    class Meta:
        db_table = 'employee'