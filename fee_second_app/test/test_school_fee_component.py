
from parent_test import ParentTestCase

from fee_second_app.models import SchoolFeeComponent, FeeDefinition, ClassBasedFilter, BusStopBasedFilter, \
    SchoolMonthlyFeeComponent

from fee_second_app.business.school_fee_component import get_school_fee_component_by_object

class SchoolFeeComponentTestCase(ParentTestCase):

    def test_get_school_component_by_object(self):

        school_component_object = SchoolFeeComponent.objects.filter(parentFeeDefinition__frequency=FeeDefinition.MONTHLY_FREQUENCY)[0]

        school_component_response = get_school_fee_component_by_object(school_component_object)

        keyCount = 4

        self.assertEqual(school_component_response['dbId'], school_component_object.id)
        self.assertEqual(school_component_response['feeDefinitionDbId'], school_component_object.parentFeeDefinition.id)
        self.assertEqual(school_component_response['title'], school_component_object.title)
        self.assertEqual(school_component_response['amount'], school_component_object.amount)

        self.assertEqual('classList' in school_component_response, school_component_object.parentFeeDefinition.classFilter)

        if 'classList' in school_component_response:

            keyCount += 1

            class_based_filter_queryset = ClassBasedFilter.objects.filter(parentSchoolFeeComponent=school_component_object)

            self.assertEqual(len(school_component_response['classList']), class_based_filter_queryset.count())

            index = 0

            for class_based_filter_object in class_based_filter_queryset.order_by('parentClass__orderNumber'):

                class_based_filter_response = school_component_response['classList'][index]

                self.assertEqual(class_based_filter_response['name'], class_based_filter_object.parentClass.name)
                self.assertEqual(class_based_filter_response['dbId'], class_based_filter_object.parentClass.id)

                index += 1

        self.assertEqual('busStop' in school_component_response, school_component_object.parentFeeDefinition.busStopFilter)

        if 'busStopList' in school_component_response:

            keyCount += 1

            bus_stop_based_filter_queryset = BusStopBasedFilter.objects.filter(parentSchoolFeeComponent=school_component_object)

            self.assertEqual(len(school_component_response['busStopList']), bus_stop_based_filter_queryset.count())

            index = 0

            for bus_stop_based_filter_object in bus_stop_based_filter_queryset.order_by('parentBusStop__kmDistance'):
                bus_stop_based_filter_response = school_component_response['busStopList'][index]

                self.assertEqual(bus_stop_based_filter_response['stopName'], bus_stop_based_filter_object.parentBusStop.stopName)
                self.assertEqual(bus_stop_based_filter_response['dbId'], bus_stop_based_filter_object.parentBusStop.id)

                index += 1

        self.assertEqual('monthList' in school_component_response,
                         (school_component_object.parentFeeDefinition.frequency==FeeDefinition.MONTHLY_FREQUENCY))

        if 'monthList' in school_component_response:

            keyCount += 1

            school_monthly_fee_component_queryset = SchoolMonthlyFeeComponent.objects.filter(parentSchoolFeeComponent=school_component_object)

            self.assertEqual(len(school_component_response['monthList']), school_monthly_fee_component_queryset.count())

            index = 0

            for school_monthly_fee_component_object in school_monthly_fee_component_queryset.order_by('parentMonth__orderNumber'):
                school_monthly_fee_component_response = school_component_response['monthList'][index]

                self.assertEqual(school_monthly_fee_component_response['month'], school_monthly_fee_component_object.parentMonth.name)
                self.assertEqual(school_monthly_fee_component_response['amount'], school_monthly_fee_component_object.amount)

                index += 1

        self.assertEqual(len(school_component_response), keyCount)
