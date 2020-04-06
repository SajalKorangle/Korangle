
import factory

from school_app.factory.school import SchoolFactory


class SMSFactory(factory.DjangoModelFactory):
    class Meta:
        model = 'sms_app.SMS'
        django_get_or_create = ('content', 'estimatedCount', 'count', 'mobileNumberList', 'parentSchool')

    content = factory.Sequence(lambda n: '%s' % n)
    estimatedCount = 10
    count = 10
    mobileNumberList = '1231231230,3213213210'
    parentSchool = factory.SubFactory(SchoolFactory)
