
import factory

from employee_app.factory.employee import EmployeeFactory


class EmployeePaymentFactory(factory.DjangoModelFactory):
    class Meta:
        model = 'salary_app.EmployeePayment'
        django_get_or_create = ('parentEmployee', 'amount', 'remark')

    parentEmployee = factory.SubFactory(EmployeeFactory)
    amount = 10000
    remark = 'testing'
