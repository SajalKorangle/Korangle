
import factory

from school_app.factory.school import SchoolFactory


class PermissionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'team_app.Permission'
        django_get_or_create = ('parentSchool', 'parentTask', 'parentUser')

    parentSchool = SchoolFactory()

