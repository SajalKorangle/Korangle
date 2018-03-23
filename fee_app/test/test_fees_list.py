from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned

from parent_test import ParentTestCase

from school_app.model.models import Fee, SubFee

from fee_app.handlers.fees_list import fees_list

class FeesListTestCase(ParentTestCase):

    def test_fees_list(self):

        data = {}

        data['startDate'] = '2017-04-01'
        data['endDate'] = '2018-03-31'

        user_object = Fee.objects.all()[0].parentStudent.parentUser

        response = fees_list(data, user_object)

        fees_list_length = 0
        for fee_object in Fee.objects.filter(parentStudent__parentUser=user_object,
                                             generationDateTime__gte=data['startDate'],
                                             generationDateTime__lte=data['endDate']).order_by('generationDateTime', 'receiptNumber'):
            self.assertEqual(fee_object.id, response[fees_list_length]['dbId'])
            self.assertEqual(fee_object.receiptNumber, response[fees_list_length]['receiptNumber'])
            self.assertEqual(fee_object.parentStudent.name, response[fees_list_length]['studentName'])
            self.assertEqual(fee_object.generationDateTime, response[fees_list_length]['generationDateTime'])
            self.assertEqual(fee_object.remark, response[fees_list_length]['remark'])
            self.assertEqual(fee_object.amount, response[fees_list_length]['amount'])

            try:
                subFee_object = SubFee.objects.get(parentFee=fee_object, particular='TuitionFee')
                self.assertEqual(subFee_object['amount'], response[fees_list_length]['tuitionFeeAmount'])
            except ObjectDoesNotExist:
                subFee_object = None
            except MultipleObjectsReturned:
                print('Error: Multiple Sub fee objects of same type, Fee Id: ' + str(fee_object))
                return

            try:
                subFee_object = SubFee.objects.get(parentFee=fee_object, particular='LateFee')
                self.assertEqual(subFee_object['amount'], response[fees_list_length]['lateFeeAmount'])
            except ObjectDoesNotExist:
                subFee_object = None
            except MultipleObjectsReturned:
                print('Error: Multiple Sub fee objects of same type, Fee Id: ' + str(fee_object))
                return

            try:
                subFee_object = SubFee.objects.get(parentFee=fee_object, particular='CautionMoney')
                self.assertEqual(subFee_object['amount'], response[fees_list_length]['cautionMoneyAmount'])
            except ObjectDoesNotExist:
                subFee_object = None
            except MultipleObjectsReturned:
                print('Error: Multiple Sub fee objects of same type, Fee Id: ' + str(fee_object))
                return

            className = fee_object.className

            self.assertEqual(className, response[fees_list_length]['className'])

            fees_list_length += 1

        self.assertEqual(fees_list_length, len(response))
