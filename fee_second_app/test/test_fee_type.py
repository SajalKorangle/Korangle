
from parent_test import ParentTestCase

from fee_second_app.business.fee_type import get_fee_type_list

from fee_second_app.models import FeeType


class FeeTypeTestCase(ParentTestCase):

    def test_get_fee_type_list(self):

        fee_type_list_response = get_fee_type_list()

        fee_type_queryset = FeeType.objects.all().order_by('name')

        self.assertEqual(len(fee_type_list_response), fee_type_queryset.count())

        index = 0

        for fee_type_object in fee_type_queryset:

            self.assertEqual(fee_type_list_response[index]['dbId'], fee_type_object.id)
            self.assertEqual(fee_type_list_response[index]['name'], fee_type_object.name)

            index += 1

