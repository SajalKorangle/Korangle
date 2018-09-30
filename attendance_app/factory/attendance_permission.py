
import factory

from employee_app.factory.employee import EmployeeFactory

from class_app.models import Section


class AttendancePermissionFactory(factory.DjangoModelFactory):
    class Meta:
        model = 'attendance_app.AttendancePermission'
        django_get_or_create = ('parentEmployee', 'parentSection')

    parentEmployee = factory.SubFactory(EmployeeFactory)
    parentSection = Section.objects.get(name='Section - A',
                                        parentClassSession__parentClass__name='Class - 12',
                                        parentClassSession__parentSession__name='Session 2017-18')
