
import factory

from school_app.factory.school import SchoolFactory


class SMSPurchaseFactory(factory.DjangoModelFactory):
    class Meta:
        model = 'sms_app.SMSPurchase'
        django_get_or_create = ('numberOfSMS', 'price', 'parentSchool')

    numberOfSMS = 5000
    price = factory.Sequence(lambda n: n)
    parentSchool = factory.SubFactory(SchoolFactory)
