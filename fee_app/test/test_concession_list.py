from parent_test import ParentTestCase

from fee_app.models import Concession

from fee_app.handlers.concession_list import concession_list

class ConcessionListTestCase(ParentTestCase):

    def test_concession_list(self):

        data = {}

        data['startDate'] = '2017-04-01'
        data['endDate'] = '2018-03-31'

        user_object = Concession.objects.all()[0].parentStudent.parentUser

        response = concession_list(data, user_object)

        concession_list_length = 0
        for concession_object in Concession.objects.filter(parentStudent__parentUser=user_object,
                                             generationDateTime__gte=data['startDate'],
                                             generationDateTime__lte=data['endDate']).order_by('generationDateTime', 'id'):
            self.assertEqual(concession_object.id, response[concession_list_length]['dbId'])
            self.assertEqual(concession_object.parentStudent.name, response[concession_list_length]['studentName'])
            self.assertEqual(concession_object.generationDateTime, response[concession_list_length]['generationDateTime'])
            self.assertEqual(concession_object.remark, response[concession_list_length]['remark'])
            self.assertEqual(concession_object.amount, response[concession_list_length]['amount'])
            self.assertEqual(concession_object.parentStudent.scholarNumber, response[concession_list_length]['scholarNumber'])

            # className = concession_object.className

            # self.assertEqual(className, response[concession_list_length]['className'])

            concession_list_length += 1

        self.assertEqual(concession_list_length, len(response))