from parent_test import ParentTestCase

from school_app.model.models import Student

from fee_app.test.test_common import common_ground

from fee_app.handlers.new_concession import new_concession

class NewConcessionTestCase(ParentTestCase):

    def test_new_concession(self):

        student_object = Student.objects.all()[0]

        data = {}

        data['studentDbId'] = student_object.id
        data['amount'] = 1000
        data['remark'] = 'testing new concession'

        response = new_concession(data, student_object.parentUser)

        self.assertEqual('Concession submitted successfully', response['message'])

        common_ground(self, response['studentData'], student_object)

