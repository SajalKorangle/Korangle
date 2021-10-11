
from parent_test import ParentTestCase

# Factory
from school_app.factory.school import SchoolFactory
from sms_app.factory.sms import SMSFactory
from sms_app.factory.sms_purchase import SMSPurchaseFactory

# Business
from sms_app.business.sms_count import get_sms_count


class SMSTestCase(ParentTestCase):

    def test_get_sms_count(self):

        school_object = SchoolFactory()

        sms_list = []

        sms_list.extend(SMSFactory.create_batch(3, parentSchool=school_object, count=100))

        sms_purchase_list = []

        sms_purchase_list.extend(SMSPurchaseFactory.create_batch(3, parentSchool=school_object, numberOfSMS=1000))

        response = get_sms_count(school_object.id)

        self.assertEqual(response['count'], 2700)
