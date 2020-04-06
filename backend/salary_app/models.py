from django.db import models

from employee_app.models import Employee

# Create your models here.


APRIL = 'APRIL'
MAY = 'MAY'
JUNE = 'JUNE'
JULY = 'JULY'
AUGUST = 'AUGUST'
SEPTEMBER = 'SEPTEMBER'
OCTOBER = 'OCTOBER'
NOVEMBER = 'NOVEMBER'
DECEMBER = 'DECEMBER'
JANUARY = 'JANUARY'
FEBRUARY = 'FEBRUARY'
MARCH = 'MARCH'
MONTH = (
    ('APRIL', 'April'),
    ('MAY', 'May'),
    ('JUNE', 'June'),
    ('JULY', 'July'),
    ('AUGUST', 'August'),
    ('SEPTEMBER', 'September'),
    ('OCTOBER', 'October'),
    ('NOVEMBER', 'November'),
    ('DECEMBER', 'December'),
    ('JANUARY', 'January'),
    ('FEBRUARY', 'February'),
    ('MARCH', 'March'),
)


class Payslip(models.Model):

    parentEmployee = models.ForeignKey(Employee, on_delete=models.PROTECT, default=0, verbose_name='parentEmployee')
    amount = models.IntegerField(null=False, verbose_name='amount', default=0)
    month = models.CharField(max_length=10, choices=MONTH, null=False, default=APRIL, verbose_name='month')
    year = models.IntegerField(null=False, verbose_name='year', default=2011)
    dateOfGeneration = models.DateField(null=False, auto_now_add=True, verbose_name='dateOfGeneration')
    remark = models.TextField(null=True, verbose_name='remark')

    class Meta:
        db_table = 'payslip'
        unique_together = ('parentEmployee', 'month', 'year')


class EmployeePayment(models.Model):

    parentEmployee = models.ForeignKey(Employee, on_delete=models.PROTECT, default=0, verbose_name='parentEmployee')
    amount = models.IntegerField(null=False, verbose_name='amount', default=0)
    dateOfPayment = models.DateField(null=False, auto_now_add=True, verbose_name='dateOfPayment')
    remark = models.TextField(null=True, verbose_name='remark')

    class Meta:
        db_table = 'employee_payment'

