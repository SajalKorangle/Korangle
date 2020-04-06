
import factory

from employee_app.factory.employee import EmployeeFactory
from school_app.model.models import Session


class EmployeeSessionDetailFactory(factory.DjangoModelFactory):
    class Meta:
        model = 'employee_app.EmployeeSessionDetail'
        django_get_or_create = ('parentEmployee', 'parentSession', 'paidLeaveNumber')

    parentEmployee = factory.SubFactory(EmployeeFactory)
    parentSession = Session.objects.all()[0]
    paidLeaveNumber = 10
