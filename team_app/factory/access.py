
import factory

from school_app.factory.school import SchoolFactory
from team_app.factory.module import ModuleFactory


class AccessFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'team_app.Access'
        django_get_or_create = ('parentSchool', 'parentModule')

    parentSchool = SchoolFactory()
    parentModule = ModuleFactory()

