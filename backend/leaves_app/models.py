from django.db import models
from school_app.model.models import School
from django.contrib.auth import get_user_model
from common.common import BasePermission
from employee_app.models import Employee
User = get_user_model()

# Choices for month
JANUARY = 'January'
FEBRUARY = 'February'
MARCH = 'March'
APRIL = 'April'
MAY = 'May'
JUNE = 'June'
JULY = 'July'
AUGUST = 'August'
SEPTEMBER = 'September'
OCTOBER = 'October'
NOVEMBER = 'November'
DECEMBER = 'December'
MONTH = (
    (JANUARY, 'January'),
    (FEBRUARY, 'February'),
    (MARCH, 'March'),
    (APRIL, 'April'),
    (MAY, 'May'),
    (JUNE, 'June'),
    (JULY, 'July'),
    (AUGUST, 'August'),
    (SEPTEMBER, 'September'),
    (OCTOBER, 'October'),
    (NOVEMBER, 'November'),
    (DECEMBER, 'December'),
)

# choices for leave type action
CFW = 'CarryForward'
ENC = 'Encashment'
LAPSE = 'Lapse'
REMAINING_LEAVES_ACTION = (
    (CFW, 'CarryForward'),
    (ENC, 'Encashment'),
    (LAPSE, 'Lapse')
)

# choices for leave type
PAID = 'Paid'
UNPAID = 'Unpaid'
LEAVE_TYPE = (
    (PAID, 'Paid'),
    (UNPAID, 'Unpaid')
)

# school leave types
class SchoolLeaveType(models.Model):

    # Leave Type Title
    # if name is invalid_type then it will not be considered
    leaveTypeName = models.TextField(
        null=False, verbose_name='leave_name', default='invalid_type')

    # Leave Paid Status
    leaveType = models.TextField(null=False, choices=LEAVE_TYPE, default="Paid")

    # School
    parentSchool = models.ForeignKey(
        School, on_delete=models.PROTECT, null=True, verbose_name='parentSchool')

    # Color Code for this Type
    color = models.TextField(
        null=False, verbose_name='color', default='#ffffff')
    
    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']

    class Meta:
        db_table = 'school_leave_type'
        unique_together = (("leaveTypeName", "parentSchool", ), ("color", "parentSchool"))

class SchoolLeavePlan(models.Model):
    # name for leave plan
    leavePlanName = models.TextField(
        null=False, verbose_name='leave_plan_name', default='invalid_type')
    # School
    parentSchool = models.ForeignKey(
        School, on_delete=models.PROTECT, null=True, verbose_name='parentSchool')
    
    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchool__id']
    class Meta:
        db_table = 'school_leave_plan'
        unique_together = (("leavePlanName", "parentSchool", ))

class SchoolLeavePlanToSchoolLeaveType(models.Model):
    # foreign key for leave plan
    parentSchoolLeavePlan = models.ForeignKey(SchoolLeavePlan, on_delete=models.PROTECT, null=False, verbose_name="parentSchoolLeavePlan")
    # foreign key for leave type
    parentSchoolLeaveType = models.ForeignKey(SchoolLeaveType, on_delete=models.PROTECT, null=False, verbose_name="parentSchoolLeaveType")

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchoolLeavePlan__parentSchool__id']
    class Meta:
        db_table = 'school_leave_plan_leave_type'
        unique_together = ('parentSchoolLeavePlan', 'parentSchoolLeaveType')
        
# leave type and number of leaves per month
class SchoolLeaveTypeMonth(models.Model):

    # School Leave Type
    parentSchoolLeaveType = models.ForeignKey(SchoolLeaveType, on_delete=models.CASCADE, default=0)
    # Month
    month = models.CharField(max_length=10, choices=MONTH, null=False, default=JANUARY, verbose_name='month')
    # Amount of leaves for the given month and given Leave Type
    value = models.IntegerField(default=0)
    # Action needs to be taken on remaining leaves
    remainingLeavesAction = models.CharField(max_length=20, choices=REMAINING_LEAVES_ACTION, null=False, default=LAPSE)

    class Meta:
        db_table = 'school_leave_type_month'
        unique_together = ('parentSchoolLeaveType', 'month')

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchoolLeaveType__parentSchool__id']
        RelationsToStudent = []

class SchoolLeavePlanToEmployee(models.Model):
    # Employee
    parentEmployee = models.ForeignKey(Employee, on_delete=models.CASCADE, default=0)
    # School Leave plan
    parentSchoolLeavePlan = models.ForeignKey(SchoolLeavePlan, on_delete=models.CASCADE, default=0)

    class Meta:
        db_table = 'school_leave_plan_employee'
        unique_together = ('parentSchoolLeavePlan', 'parentEmployee')

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchoolLeavePlan__parentSchool__id']
