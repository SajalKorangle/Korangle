
'''import factory

from school_app.factory.school import SchoolFactory

class MemberFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'team_app.Member'
        django_get_or_create = ('parentSchool', 'parentUser')

    parentSchool = factory.SubFactory(SchoolFactory)
'''