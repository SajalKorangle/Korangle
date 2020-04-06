
import factory

from employee_app.factory.employee import EmployeeFactory


class PayslipFactory(factory.DjangoModelFactory):
    class Meta:
        model = 'salary_app.Payslip'
        django_get_or_create = ('parentEmployee', 'amount', 'remark', 'month', 'year')

    parentEmployee = factory.SubFactory(EmployeeFactory)
    month='OCTOBER'
    year=2018
    amount = 10000
    remark = 'testing'
