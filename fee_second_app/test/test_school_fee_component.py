
from parent_test import ParentTestCase

from fee_second_app.models import SchoolFeeComponent, FeeDefinition, ClassBasedFilter, BusStopBasedFilter, \
    SchoolMonthlyFeeComponent, FeeType, Month, ClassBasedFilter, BusStopBasedFilter
from class_app.models import Class
from school_app.model.models import BusStop

from fee_second_app.business.school_fee_component import get_school_fee_component_by_object, \
    create_school_fee_component, update_school_fee_component, delete_school_fee_component

from fee_second_app.factories.fee_definition import FeeDefinitionFactory
from fee_second_app.factories.school_fee_component import SchoolFeeComponentFactory


class SchoolFeeComponentTestCase(ParentTestCase):

    def test_get_school_fee_component_by_object(self):

        school_fee_component_object = SchoolFeeComponent.objects.filter(parentFeeDefinition__frequency=FeeDefinition.MONTHLY_FREQUENCY)[0]

        school_fee_component_response = get_school_fee_component_by_object(school_fee_component_object)

        keyCount = 4

        self.assertEqual(school_fee_component_response['dbId'], school_fee_component_object.id)
        self.assertEqual(school_fee_component_response['feeDefinitionDbId'], school_fee_component_object.parentFeeDefinition.id)
        self.assertEqual(school_fee_component_response['title'], school_fee_component_object.title)
        self.assertEqual(school_fee_component_response['amount'], school_fee_component_object.amount)

        self.assertEqual('classList' in school_fee_component_response, school_fee_component_object.parentFeeDefinition.classFilter)

        if 'classList' in school_fee_component_response:

            keyCount += 1

            class_based_filter_queryset = ClassBasedFilter.objects.filter(parentSchoolFeeComponent=school_fee_component_object)

            self.assertEqual(len(school_fee_component_response['classList']), class_based_filter_queryset.count())

            index = 0

            for class_based_filter_object in class_based_filter_queryset.order_by('parentClass__orderNumber'):

                class_based_filter_response = school_fee_component_response['classList'][index]

                self.assertEqual(class_based_filter_response['name'], class_based_filter_object.parentClass.name)
                self.assertEqual(class_based_filter_response['dbId'], class_based_filter_object.parentClass.id)

                index += 1

        self.assertEqual('busStop' in school_fee_component_response, school_fee_component_object.parentFeeDefinition.busStopFilter)

        if 'busStopList' in school_fee_component_response:

            keyCount += 1

            bus_stop_based_filter_queryset = BusStopBasedFilter.objects.filter(parentSchoolFeeComponent=school_fee_component_object)

            self.assertEqual(len(school_fee_component_response['busStopList']), bus_stop_based_filter_queryset.count())

            index = 0

            for bus_stop_based_filter_object in bus_stop_based_filter_queryset.order_by('parentBusStop__kmDistance'):
                bus_stop_based_filter_response = school_fee_component_response['busStopList'][index]

                self.assertEqual(bus_stop_based_filter_response['stopName'], bus_stop_based_filter_object.parentBusStop.stopName)
                self.assertEqual(bus_stop_based_filter_response['dbId'], bus_stop_based_filter_object.parentBusStop.id)

                index += 1

        self.assertEqual('monthList' in school_fee_component_response,
                         (school_fee_component_object.parentFeeDefinition.frequency==FeeDefinition.MONTHLY_FREQUENCY))

        if 'monthList' in school_fee_component_response:

            keyCount += 1

            school_monthly_fee_component_queryset = SchoolMonthlyFeeComponent.objects.filter(parentSchoolFeeComponent=school_fee_component_object)

            self.assertEqual(len(school_fee_component_response['monthList']), school_monthly_fee_component_queryset.count())

            index = 0

            for school_monthly_fee_component_object in school_monthly_fee_component_queryset.order_by('parentMonth__orderNumber'):
                school_monthly_fee_component_response = school_fee_component_response['monthList'][index]

                self.assertEqual(school_monthly_fee_component_response['month'], school_monthly_fee_component_object.parentMonth.name)
                self.assertEqual(school_monthly_fee_component_response['amount'], school_monthly_fee_component_object.amount)

                index += 1

        self.assertEqual(len(school_fee_component_response), keyCount)

    def test_create_school_fee_component(self):

        fee_definition_object = FeeDefinitionFactory()

        data = {
            'feeDefinitionDbId': fee_definition_object.id,
            'title': 'Test School Fee Component',
        }
        data['classList'] = []
        data['busStopList'] = []
        data['monthList'] = []

        class_object = Class.objects.get(name='Class - 12')
        tempClassData = {
            'dbId': class_object.id,
            'name': class_object.name,
        }
        data['classList'].append(tempClassData)

        bus_stop_object = BusStop.objects.filter(parentSchool=fee_definition_object.parentSchool)[0]
        tempBusStopData = {
            'dbId': bus_stop_object.id,
            'stopName': bus_stop_object.stopName,
        }
        data['busStopList'].append(tempBusStopData)

        for month_object in Month.objects.all().order_by('orderNumber'):
            tempMonthData = {
                'month': month_object.name,
                'amount': month_object.orderNumber*100,
            }
            data['monthList'].append(tempMonthData)

        create_school_fee_component(data)

        school_fee_component_object = SchoolFeeComponent.objects.get(parentFeeDefinition_id=fee_definition_object.id,
                                                                     title=data['title'])

        ClassBasedFilter.objects.get(parentSchoolFeeComponent=school_fee_component_object,
                                     parentClass=class_object)

        BusStopBasedFilter.objects.get(parentSchoolFeeComponent=school_fee_component_object,
                                       parentBusStop=bus_stop_object)

        for month_data in data['monthList']:

            SchoolMonthlyFeeComponent.objects.get(parentSchoolFeeComponent=school_fee_component_object,
                                                  parentMonth__name=month_data['month'],
                                                  amount=month_data['amount'])

        self.assertEqual(12, SchoolMonthlyFeeComponent.objects.filter(
            parentSchoolFeeComponent=school_fee_component_object).count())

    def test_update_school_fee_component(self):

        school_fee_component_object = SchoolFeeComponentFactory()

        data = {
            'dbId': school_fee_component_object.id,
            'feeDefinitionDbId': school_fee_component_object.parentFeeDefinition.id,
            'title': 'Changed',
        }

        data['monthList'] = []

        for month_object in Month.objects.order_by('orderNumber'):
            tempData = {
                'month': month_object.name,
                'amount': 10000
            }
            data['monthList'].append(tempData)

        response = update_school_fee_component(data)

        school_fee_component_object = SchoolFeeComponent.objects.get(id=data['dbId'])

        self.assertEqual(school_fee_component_object.parentFeeDefinition.id, data['feeDefinitionDbId'])
        self.assertEqual(school_fee_component_object.title, data['title'])

        for month_data in data['monthList']:

            student_monthly_fee_component_object = \
            SchoolMonthlyFeeComponent.objects.get(parentSchoolFeeComponent=school_fee_component_object,
                                                  parentMonth__name=month_data['month'])

            self.assertEqual(student_monthly_fee_component_object.amount, month_data['amount'])


    def test_delete_school_fee_component(self):

        school_fee_component_object = SchoolFeeComponentFactory()

        data = {
            'dbId': school_fee_component_object.id
        }

        delete_school_fee_component(data)

        self.assertEqual(SchoolFeeComponent.objects.filter(id=data['dbId']).count(), 0)
        self.assertEqual(ClassBasedFilter.objects.filter(parentSchoolFeeComponent_id=data['dbId']).count(), 0)
        self.assertEqual(BusStopBasedFilter.objects.filter(parentSchoolFeeComponent_id=data['dbId']).count(), 0)
        self.assertEqual(SchoolMonthlyFeeComponent.objects.filter(parentSchoolFeeComponent_id=data['dbId']).count(), 0)

