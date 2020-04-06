
from parent_test import ParentTestCase

import datetime

# Factory
from school_app.factory.school import SchoolFactory
from sms_app.factory.sms import SMSFactory

# Business
from sms_app.business.sms import get_sms_list, create_sms

# Model
from sms_app.models import SMS


class SMSTestCase(ParentTestCase):

    def test_get_sms_list(self):

        school_object = SchoolFactory()

        sms_list = []

        sms_list.extend(SMSFactory.create_batch(3, parentSchool=school_object))

        data = {
            'parentSchool': school_object.id,
            'startDateTime': datetime.date.today().__str__() + ' 00:00:00+05:30',
            'endDateTime': datetime.date.today().__str__() + ' 23:59:59+05:30',
        }

        response = get_sms_list(data)

        self.assertEqual(len(response), 3)

        index = 0
        for sms in sms_list:
            sms_response = response[index]
            self.assertEqual(sms.parentSchool.id, school_object.id)
            self.assertEqual(sms_response['id'], sms.id)
            index += 1

    def test_create_sms(self):

        school_object = SchoolFactory()

        data = {
            'content': 'okay',
            'estimatedCount': 10,
            'count': 10,
            'mobileNumberList': '1231231230,3213213210',
            'parentSchool': school_object.id,
        }

        create_sms(data)

        SMS.objects.get(content=data['content'],
                        estimatedCount=data['estimatedCount'],
                        count=data['count'],
                        mobileNumberList=data['mobileNumberList'],
                        parentSchool_id=data['parentSchool'])
