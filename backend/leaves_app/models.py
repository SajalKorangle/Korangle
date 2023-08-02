from django.db import models
from school_app.model.models import School
from django.contrib.auth import get_user_model
from common.common import BasePermission
from employee_app.models import Employee
from django.db.models.signals import pre_save, post_save, pre_delete, post_delete
from django.dispatch import receiver
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
@receiver(post_save, sender = SchoolLeaveType)
def update_employee_leave_type(sender, instance, **kwargs):
    if instance.id is not None:
        employeeLeaveTypeList = EmployeeLeaveType.objects.filter(parentLeaveType__id=instance.id)
        for employeeLeaveType in employeeLeaveTypeList:
            employeeLeaveType.leaveTypeName = instance.leaveTypeName
            employeeLeaveType.color = instance.color
            employeeLeaveType.leaveType = instance.leaveType
            employeeLeaveType.save()
    
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
@receiver(post_save, sender = SchoolLeavePlan) 
def update_employee_leave_plan(sender, instance, **kwargs):
    if instance.id is not None:
        employeeLeavePlanList = SchoolLeavePlanToEmployee.objects.filter(parentSchoolLeavePlan__id=instance.id)
        for employeeLeavePlan in employeeLeavePlanList:
            employeeLeavePlan.leavePlanName = instance.leavePlanName
            employeeLeavePlan.save()

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
@receiver(post_save, sender = SchoolLeavePlanToSchoolLeaveType)
def add_employee_leave_type_on_leave_type(sender, instance, **kwargs):
    try:
        if instance.id is not None:
            SchoolLeavePlanToEmployeeList = SchoolLeavePlanToEmployee.objects.filter(parentSchoolLeavePlan__id=instance.parentSchoolLeavePlan.id)
            for schoolLeavePlanToEmployee in SchoolLeavePlanToEmployeeList:
                isCustomized = schoolLeavePlanToEmployee.isCustomized
                try:
                    EmployeeLeaveType.objects.get(parentEmployee__id=schoolLeavePlanToEmployee.parentEmployee.id, parentLeaveType__id=instance.parentSchoolLeaveType.id)
                    continue
                except:
                    if not isCustomized:
                        employeeLeaveType = EmployeeLeaveType()
                        employeeLeaveType.parentEmployee = schoolLeavePlanToEmployee.parentEmployee
                        employeeLeaveType.parentLeaveType = instance.parentSchoolLeaveType
                        employeeLeaveType.leaveTypeName = instance.parentSchoolLeaveType.leaveTypeName
                        employeeLeaveType.color = instance.parentSchoolLeaveType.color
                        employeeLeaveType.leaveType = instance.parentSchoolLeaveType.leaveType
                        employeeLeaveType.save()
    except:
        pass

@receiver(post_delete, sender = SchoolLeavePlanToSchoolLeaveType)
def delete_employee_leave_type_on_leave_type(sender, instance, **kwargs):
    try:
        if instance.id is not None:
            SchoolLeavePlanToEmployeeList = SchoolLeavePlanToEmployee.objects.filter(parentSchoolLeavePlan__id=instance.parentSchoolLeavePlan.id)
            for schoolLeavePlanToEmployee in SchoolLeavePlanToEmployeeList:
                if schoolLeavePlanToEmployee.isCustomized:
                    continue
                employeeLeaveType = EmployeeLeaveType.objects.filter(parentEmployee__id=schoolLeavePlanToEmployee.parentEmployee.id, parentLeaveType__id=instance.parentSchoolLeaveType.id)
                employeeLeaveType.delete()
    except:
        pass

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
    parentEmployee = models.ForeignKey(Employee, on_delete=models.CASCADE, default=0, unique=True)
    # School Leave plan
    parentSchoolLeavePlan = models.ForeignKey(SchoolLeavePlan, on_delete=models.CASCADE, default=0)
    # Boolean for customized plan
    isCustomized = models.BooleanField(default=False, null=False)
    # Leave Plan Name
    leavePlanName = models.TextField(null=False, verbose_name='leave_plan_name', default='invalid_plan')

    class Meta:
        db_table = 'school_leave_plan_employee'

    class Permissions(BasePermission):
        RelationsToSchool = ['parentSchoolLeavePlan__parentSchool__id']
@receiver(pre_save, sender=SchoolLeavePlanToEmployee)
def validate_leave_type_on_employee(sender, instance, **kwargs):
    if instance.id is not None:
        try:
            similarObject = SchoolLeavePlanToEmployee.objects.get(pk=instance.id)
            if instance.parentSchoolLeavePlan.id != similarObject.parentSchoolLeavePlan.id:
                employeeLeaveTypeList = EmployeeLeaveType.objects.filter(parentEmployee__id=instance.parentEmployee.id)
                employeeLeaveTypeList.delete()
        except:
            pass

@receiver(post_save, sender=SchoolLeavePlanToEmployee)
def add_employee_leave_type_on_employee(sender, instance, **kwargs):
    if instance.id is not None:
        try:
            schoolLeavePlanToLeaveTypeList = SchoolLeavePlanToSchoolLeaveType.objects.filter(parentSchoolLeavePlan__id=instance.parentSchoolLeavePlan.id)
            isCustomized = instance.isCustomized
            for schoolLeavePlanToLeaveType in schoolLeavePlanToLeaveTypeList:
                try:
                    if isCustomized:
                        continue
                    EmployeeLeaveType.objects.get(parentEmployee__id=instance.parentEmployee.id, parentLeaveType__id=schoolLeavePlanToLeaveType.parentSchoolLeaveType.id)
                except:
                    # if there is no employee leave type then create it
                    employeeLeaveType = EmployeeLeaveType()
                    employeeLeaveType.parentEmployee = instance.parentEmployee
                    employeeLeaveType.parentLeaveType = schoolLeavePlanToLeaveType.parentSchoolLeaveType
                    employeeLeaveType.leaveTypeName = schoolLeavePlanToLeaveType.parentSchoolLeaveType.leaveTypeName
                    employeeLeaveType.color = schoolLeavePlanToLeaveType.parentSchoolLeaveType.color
                    employeeLeaveType.leaveType = schoolLeavePlanToLeaveType.parentSchoolLeaveType.leaveType
                    employeeLeaveType.save()
        except:
            pass

@receiver(post_delete, sender=SchoolLeavePlanToEmployee)
def delete_employee_leave_type_on_employee(sender, instance, **kwargs):
    if instance.id is not None:
        try:
            employeeLeaveTypeList = EmployeeLeaveType.objects.filter(parentEmployee__id=instance.parentEmployee.id)
            employeeLeaveTypeList.delete()
        except:
            pass

class EmployeeLeaveType(models.Model):
    # Employee
    parentEmployee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    # Leave Type
    parentLeaveType = models.ForeignKey(SchoolLeaveType, on_delete=models.CASCADE)
    # Leave Type Name
    leaveTypeName = models.TextField(
        null=False, verbose_name='leave_name', default='invalid_type')
    # Leave Paid Status
    leaveType = models.TextField(null=False, choices=LEAVE_TYPE, default="Paid")
    # Color Code for this Type
    color = models.TextField(
        null=False, verbose_name='color', default='#ffffff')

    class Meta:
        db_table = 'employee_leave_type'
        unique_together = ('parentLeaveType', 'parentEmployee')

    class Permissions(BasePermission):
        RelationToSchool = ['parentLeaveType__parentSchool__id']

@receiver(pre_save, sender = EmployeeLeaveType)
def add_leave_type_data(sender, instance, *args, **kwargs):
    try:
        parentLeaveType = SchoolLeaveType.objects.get(pk = instance.parentLeaveType.id)
        instance.leaveTypeName = parentLeaveType.leaveTypeName
        instance.leaveType = parentLeaveType.leaveType
        instance.color = parentLeaveType.color
    except:
        pass
@receiver(post_save, sender = EmployeeLeaveType)
def update_leave_plan_to_employee_data(sender, instance, *args, **kwargs):
    try:
        leavePlanToEmployee = SchoolLeavePlanToEmployee.objects.get(parentEmployee__id=instance.parentEmployee.id)
        leavePlan = leavePlanToEmployee.parentSchoolLeavePlan
        planParentLeaveTypeIdList = [object.parentSchoolLeaveType.id for object in SchoolLeavePlanToSchoolLeaveType.objects.filter(parentSchoolLeavePlan__id=leavePlan.id)]
        employeeParentLeaveTypeIdList = [object.parentLeaveType.id for object in EmployeeLeaveType.objects.filter(parentEmployee__id=instance.parentEmployee.id)]
        isCustomized = leavePlanToEmployee.isCustomized
        if planParentLeaveTypeIdList != employeeParentLeaveTypeIdList:
            leavePlanToEmployee.isCustomized = True
        else:
            leavePlanToEmployee.isCustomized = False
        if leavePlanToEmployee.isCustomized != isCustomized:
            leavePlanToEmployee.save()
    except:
        pass
@receiver(post_delete, sender = EmployeeLeaveType)
def delete_leave_plan_to_employee_data(sender, instance, *args, **kwargs):
    try:
        leavePlanToEmployee = SchoolLeavePlanToEmployee.objects.get(parentEmployee__id=instance.parentEmployee.id)
        leavePlan = leavePlanToEmployee.parentSchoolLeavePlan
        planParentLeaveTypeIdList = [object.parentSchoolLeaveType.id for object in SchoolLeavePlanToSchoolLeaveType.objects.filter(parentSchoolLeavePlan__id=leavePlan.id)]
        employeeParentLeaveTypeIdList = [object.parentLeaveType.id for object in EmployeeLeaveType.objects.filter(parentEmployee__id=instance.parentEmployee.id)]
        isCustomized = leavePlanToEmployee.isCustomized
        if planParentLeaveTypeIdList != employeeParentLeaveTypeIdList:
            leavePlanToEmployee.isCustomized = True
        else:
            leavePlanToEmployee.isCustomized = False
        if leavePlanToEmployee.isCustomized != isCustomized:
            leavePlanToEmployee.save()
    except:
        pass
