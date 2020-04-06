
import factory


from employee_app.factory.employee import EmployeeFactory
from team_app.factory.module import ModuleFactory

from team_app.models import Module


class EmployeePermissionFactory(factory.DjangoModelFactory):
    class Meta:
        model = 'employee_app.EmployeePermission'
        django_get_or_create = ('parentTask', 'parentEmployee')

    parentEmployee = factory.SubFactory(EmployeeFactory)
    parentTask = ModuleFactory().task_set.all()[0]
