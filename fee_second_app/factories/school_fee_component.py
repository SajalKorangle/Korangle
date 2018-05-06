import factory

from fee_second_app.factories.fee_definition import FeeDefinitionFactory

from class_app.models import Class
from school_app.model.models import BusStop
from fee_second_app.models import Month


class BusStopBasedFilterFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'fee_second_app.BusStopBasedFilter'
        django_get_or_create = ('parentSchoolFeeComponent', 'parentBusStop')


class ClassBasedFilterFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'fee_second_app.ClassBasedFilter'
        django_get_or_create = ('parentSchoolFeeComponent', 'parentClass')

    parentClass = Class.objects.get(name='Class - 12')


class SchoolMonthlyFeeComponentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'fee_second_app.SchoolMonthlyFeeComponent'
        django_get_or_create = ('parentSchoolFeeComponent', 'parentMonth', 'amount')

    amount = 1000


class SchoolFeeComponentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'fee_second_app.SchoolFeeComponent'
        django_get_or_create = ('parentFeeDefinition', 'title', 'amount')

    parentFeeDefinition = factory.SubFactory(FeeDefinitionFactory)
    title = 'Test School Fee Component'
    amount = 1000

    @factory.post_generation
    def classBasedFilter(self, create, extracted, **kwargs):
        if not create:
            return
        else:
            if self.parentFeeDefinition.classFilter:
                ClassBasedFilterFactory(parentSchoolFeeComponent=self)

    @factory.post_generation
    def busStopBasedFilter(self, create, extracted, **kwargs):
        if not create:
            return
        else:
            if self.parentFeeDefinition.busStopFilter:
                BusStopBasedFilterFactory(parentSchoolFeeComponent=self,
                                          parentBusStop=BusStop.objects.filter(
                                              parentSchool=self.parentFeeDefinition.parentSchool)[0])

    @factory.post_generation
    def schoolMonthlyFeeComponent(self, create, extracted, **kwargs):
        if not create:
            return
        else:
            for month_object in Month.objects.all():
                SchoolMonthlyFeeComponentFactory(
                    parentSchoolFeeComponent=self,
                    parentMonth=month_object)

