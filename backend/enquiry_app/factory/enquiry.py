
import factory

from school_app.factory.school import SchoolFactory

from class_app.models import Class


class EnquiryFactory(factory.DjangoModelFactory):
    class Meta:
        model = 'enquiry_app.Enquiry'
        django_get_or_create = ('studentName', 'enquirerName', 'parentClass', 'parentSchool')

    studentName = factory.Sequence(lambda n: '%s' % n)
    enquirerName = factory.LazyAttribute(lambda n: 'name_%s' % n)
    parentClass = Class.objects.get(name='Class - 12')
    parentSchool = factory.SubFactory(SchoolFactory)
