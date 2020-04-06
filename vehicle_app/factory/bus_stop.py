
import factory

from school_app.factory.school import SchoolFactory


class BusStopFactory(factory.DjangoModelFactory):
    class Meta:
        model = 'school_app.BusStop'
        django_get_or_create = ('stopName', 'kmDistance', 'parentSchool')

    kmDistance = factory.Sequence(lambda n: n)
    stopName = factory.LazyAttribute(lambda obj: 'stop_name_%s' % obj.kmDistance)
    parentSchool = factory.SubFactory(SchoolFactory)
