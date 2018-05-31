
from parent_test import ParentTestCase

import datetime

# Factory
from school_app.factory.school import SchoolFactory
from sms_app.factory.sms_purchase import SMSPurchaseFactory

# Business
from sms_app.business.sms_purchase import get_sms_purchase_list

# Model
from sms_app.models import SMS


class SMSPurchaseTestCase(ParentTestCase):

    def test_get_sms_purchase_list(self):

        school_object = SchoolFactory()

        sms_purchase_list = []

        sms_purchase_list.extend(SMSPurchaseFactory.create_batch(3, parentSchool=school_object))

        data = {
            'parentSchool': school_object.id
        }

        response = get_sms_purchase_list(data)

        self.assertEqual(len(response), 3)

        index = 0
        for sms_purchase in sms_purchase_list:
            sms_purchase_response = response[index]
            self.assertEqual(sms_purchase.parentSchool.id, school_object.id)
            self.assertEqual(sms_purchase_response['id'], sms_purchase.id)
            index += 1
