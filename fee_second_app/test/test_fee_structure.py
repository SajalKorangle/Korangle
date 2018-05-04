
from parent_test import ParentTestCase

from school_app.model.models import School

from fee_second_app.models import FeeDefinition, SchoolFeeComponent

from fee_second_app.business.fee_structure import get_fee_structure


class FeeStructureTestCase(ParentTestCase):

    def test_get_fee_structure(self):

        school_id = School.objects.filter(name='BRIGHT STAR')[0].id

        data = {
            'schoolDbId': school_id,
            'sessionDbId': 1,
        }

        fee_structure_response = get_fee_structure(data)

        fee_definition_queryset = FeeDefinition.objects.filter(parentSchool_id=data['schoolDbId'], parentSession_id=data['sessionDbId'])

        self.assertEqual(len(fee_structure_response), fee_definition_queryset.count())

        index = 0

        for fee_definition_object in fee_definition_queryset.order_by('orderNumber'):

            fee_definition_response = fee_structure_response[index]

            self.assertEqual(fee_definition_response['dbId'], fee_definition_object.id)

            school_fee_component_queryset = SchoolFeeComponent.objects.filter(parentFeeDefinition=fee_definition_object)

            self.assertEqual(len(fee_definition_response['schoolFeeComponentList']), school_fee_component_queryset.count())

            secondIndex = 0

            for school_fee_component_object in school_fee_component_queryset.order_by('title'):

                school_fee_component_response = fee_definition_response['schoolFeeComponentList'][secondIndex]

                self.assertEqual(school_fee_component_response['dbId'], school_fee_component_object.id)

                secondIndex += 1

            index += 1
