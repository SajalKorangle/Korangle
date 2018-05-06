import factory

from fee_second_app.factories.fee_type import FeeTypeFactory

from school_app.model.models import School, Session
from fee_second_app.models import FeeDefinition


class FeeDefinitionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'fee_second_app.FeeDefinition'
        django_get_or_create = ('parentSchool', 'parentSession', 'parentFeeType', 'orderNumber', 'rte',
                                'onlyNewStudent', 'classFilter', 'busStopFilter', 'frequency')

    parentFeeType = factory.SubFactory(FeeTypeFactory)
    parentSchool = School.objects.get(name='BRIGHT STAR')
    parentSession = Session.objects.get(name='Session 2017-18')
    orderNumber = 1
    rte = False
    onlyNewStudent = False
    classFilter = True
    busStopFilter = True
    frequency = FeeDefinition.MONTHLY_FREQUENCY

