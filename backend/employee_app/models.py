from django.db import models
from common.common import BasePermission

from school_app.model.models import School, Session
from team_app.models import Task
import os
from django.utils.timezone import now
from common.common import BasePermission


def upload_avatar_to(instance, filename):
    filename_base, filename_ext = os.path.splitext(filename)
    return 'employees/%s/profile_image/%s%s' % (instance.id, now().timestamp(), filename_ext.lower())

def upload_document_to(instance,filename):
    return 'employee_app/EmployeeParameterValue/document_value/%s_%s' % (now().timestamp(),filename)

class Employee(models.Model):

    # ProfileImage
    profileImage = models.ImageField("Avatar", upload_to=upload_avatar_to, blank=True)

    # Name
    name = models.CharField(max_length=100)

    # Father's Name
    fatherName = models.CharField(max_length=100)

    # Mother's Name
    motherName = models.CharField(max_length=100, null=True)

    # Spouse's Name
    spouseName = models.CharField(max_length=100, null=True)

    # Date of Birth
    dateOfBirth = models.DateField(null=True)

    # Gender
    gender = models.TextField(null=True)

    # Mobile Number
    mobileNumber = models.BigIntegerField(null=True)

    # Address
    address = models.TextField(null=True)

    # Aadhar No.
    aadharNumber = models.BigIntegerField(null=True)

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

    # Bank IFSC Code
    bankIfscCode = models.TextField(null=True, blank=True)

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

    # Monthly Salary
    monthlySalary = models.IntegerField(null=True)

    # Pran No.
    pranNumber = models.TextField(null=True)

    # Joining Date
    dateOfLeaving = models.DateField(null=True)

    # School Id
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0, related_name="employeeList")

    # Is Employee a third party vendor
    isNonSalariedEmployee = models.BooleanField(null=False, default=False)

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']

    class Meta:
        db_table = 'employee'
        unique_together = ('parentSchool', 'mobileNumber')

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']
        RelationsToStudent = []


class EmployeeSessionDetail(models.Model):

    parentEmployee = models.ForeignKey(Employee, on_delete=models.CASCADE, null=False, verbose_name='parentEmployee', default=0)
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=False, verbose_name='parentSession', default=0)
    paidLeaveNumber = models.IntegerField(null=True, verbose_name='paidLeaveNumber')

    class Meta:
        db_table = 'employee_session_detail'
        unique_together = ('parentEmployee', 'parentSession')


class EmployeePermission(models.Model):

    parentTask = models.ForeignKey(Task, on_delete=models.PROTECT, null=False, verbose_name='parentTask', default=0)
    parentEmployee = models.ForeignKey(Employee, on_delete=models.CASCADE, null=False, verbose_name='parentEmployee', default=0)
    configJSON = models.TextField(default="{}")

    def __str__(self):
        return self.parentEmployee.parentSchool.name + ' -- ' + self.parentEmployee.name + ' -- ' + str(self.parentTask)

    class Meta:
        db_table = 'employee_permission'
        unique_together = ('parentTask', 'parentEmployee')

    class Permissions(BasePermission):
        RelationsToSchool = ['parentEmployee__parentSchool__id']
        RelationsToStudent = []

class EmployeeParameter(models.Model):

    parentSchool = models.ForeignKey(School, on_delete=models.CASCADE, default=0, verbose_name='parentSchool')

    name = models.CharField(max_length=100)

    PARAMETER_TYPE = (
        ( 'TEXT', 'TEXT' ),
        ( 'FILTER', 'FILTER' ),
        ( 'DOCUMENT','DOCUMENT')
    )
    parameterType = models.CharField(max_length=20, choices=PARAMETER_TYPE, null=False)

    filterValues = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'employee_parameter'

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']
        RelationsToStudent = []


class EmployeeParameterValue(models.Model):

    parentEmployee = models.ForeignKey(Employee, on_delete=models.CASCADE, default=0, verbose_name='parentEmployee')
    parentEmployeeParameter = models.ForeignKey(EmployeeParameter, on_delete=models.CASCADE, default=0, verbose_name='parentEmployeeParameter')

    value = models.TextField(null=True,blank=True)
    document_value = models.FileField(upload_to=upload_document_to, max_length=500, blank=True, null=True)
    document_size = models.TextField(null=True,blank=True)

    class Meta:
        db_table = 'employee_parameter_value'
        unique_together = ('parentEmployee', 'parentEmployeeParameter')
