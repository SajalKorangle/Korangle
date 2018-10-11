
import factory

from school_app.factory.school import SchoolFactory


class EmployeeFactory(factory.DjangoModelFactory):
    class Meta:
        model = 'employee_app.Employee'
        django_get_or_create = ('name', 'fatherName', 'parentSchool', 'employeeNumber', 'mobileNumber')

    employeeNumber = factory.Sequence(lambda n: '%s' % n)
    mobileNumber = factory.Sequence(lambda n: n)
    name = factory.LazyAttribute(lambda obj: 'name_%s' % obj.employeeNumber)
    fatherName = factory.LazyAttribute(lambda obj: 'fatherName_%s' % obj.employeeNumber)
    parentSchool = factory.SubFactory(SchoolFactory)
