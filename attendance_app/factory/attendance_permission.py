
import factory

from school_app.factory.school import SchoolFactory

from class_app.models import Section
from django.contrib.auth.models import User


class AttendancePermissionFactory(factory.DjangoModelFactory):
    class Meta:
        model = 'attendance_app.AttendancePermission'
        django_get_or_create = ('parentSchool', 'parentUser', 'parentSection')

    parentSchool = factory.SubFactory(SchoolFactory)
    parentUser = User.objects.all()[0]
    parentSection = Section.objects.get(name='Section - A',
                                        parentClassSession__parentClass__name='Class - 12',
                                        parentClassSession__parentSession__name='Session 2017-18')
