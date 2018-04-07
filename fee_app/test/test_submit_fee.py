from parent_test import ParentTestCase

from student_app.models import Student

from fee_app.test.test_common import common_ground

from fee_app.handlers.submit_fee import new_fee_receipt

import datetime

class SubmitFeeTestCase(ParentTestCase):

    def test_new_fee_receipt(self):

        print(self.__str__())

        student_object = Student.objects.all()[0]

        data = {}

        data['studentDbId'] = student_object.id
        data['receiptNumber'] = 10045
        data['generationDateTime'] = datetime.date.today().__str__()
        data['amount'] = 1000
        data['remark'] = 'testing new fee receipt'
        data['tuitionFeeAmount'] = 1000

        response = new_fee_receipt(data, student_object.parentUser)

        self.assertEqual('success', response['status'])
        self.assertEqual('Fee submitted successfully', response['message'])
        common_ground(self, response['studentData'], student_object)

