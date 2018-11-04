from django.db import models

from school_app.model.models import School, Session
from team_app.models import Task


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

    # Monthly Salary
    monthlySalary = models.IntegerField(null=True)

    # Joining Date
    dateOfLeaving = models.DateField(null=True)

    # School Id
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, default=0)

    class Meta:
        db_table = 'employee'
        unique_together = ('parentSchool', 'mobileNumber')


class EmployeeSessionDetail(models.Model):

    parentEmployee = models.ForeignKey(Employee, on_delete=models.PROTECT, null=False, verbose_name='parentEmployee', default=0)
    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=False, verbose_name='parentSession', default=0)
    paidLeaveNumber = models.IntegerField(null=True, verbose_name='paidLeaveNumber')

    class Meta:
        db_table = 'employee_session_detail'
        unique_together = ('parentEmployee', 'parentSession')


class EmployeePermission(models.Model):

    parentTask = models.ForeignKey(Task, on_delete=models.PROTECT, null=False, verbose_name='parentTask', default=0)
    parentEmployee = models.ForeignKey(Employee, on_delete=models.PROTECT, null=False, verbose_name='parentEmployee', default=0)

    def __str__(self):
        return self.parentSchool.name + ' -- ' + self.parentEmployee.name + ' -- ' + str(self.parentTask)

    class Meta:
        db_table = 'employee_permission'
        unique_together = ('parentTask', 'parentEmployee')

