
import factory

from employee_app.factory.employee import EmployeeFactory

from class_app.models import Division, Class
from school_app.model.models import Session


class AttendancePermissionFactory(factory.DjangoModelFactory):
    class Meta:
        model = 'attendance_app.AttendancePermission'
        django_get_or_create = ('parentEmployee', 'parentSession', 'parentDivision', 'parentClass')

    parentEmployee = factory.SubFactory(EmployeeFactory)
    parentDivision = Division.objects.get(name='Section - A')
    parentClass = Class.objects.get(name='Class - 12')
    parentSession = Session.objects.get(name='Session 2017-18')
