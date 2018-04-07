from parent_test import ParentTestCase

from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned

from fee_app.models import Fee, Concession

from fee_app.handlers.common import get_student_fee_data


def common_ground(testCase, response, student_object):
    testCase.assertEqual(student_object.id, response['dbId'])
    testCase.assertEqual(student_object.fathersName, response['fathersName'])
    testCase.assertEqual(student_object.scholarNumber, response['scholarNumber'])
    testCase.assertEqual(student_object.totalFees, response['totalFees'])

    feesDue = student_object.totalFees
    feesListLength = 0
    for fee_object in student_object.fee_set.all().order_by('-generationDateTime', 'id'):

        tuitionFeeAmount = 0
        lateFeeAmount = 0
        cautionMoneyAmount = 0

        try:
            subFee_object = fee_object.subfee_set.get(particular='TutionFee')
            tuitionFeeAmount = subFee_object.amount
        except ObjectDoesNotExist:
            subFee_object = None
        except MultipleObjectsReturned:
            print('Error: Multiple Sub Fees of single type for a fee, Fee DbId: ' + fee_object.id)
            return

        try:
            subFee_object = fee_object.subfee_set.get(particular='LateFee')
            lateFeeAmount = subFee_object.amount
        except ObjectDoesNotExist:
            subFee_object = None
        except MultipleObjectsReturned:
            print('Error: Multiple Sub Fees of single type for a fee, Fee DbId: ' + fee_object.id)
            return

        try:
            subFee_object = fee_object.subfee_set.get(particular='CautionMoney')
            cautionMoneyAmount = subFee_object.amount
        except ObjectDoesNotExist:
            subFee_object = None
        except MultipleObjectsReturned:
            print('Error: Multiple Sub Fees of single type for a fee, Fee DbId: ' + fee_object.id)
            return

        testCase.assertEqual(fee_object.id, response['feesList'][feesListLength]['dbId'])
        testCase.assertEqual(fee_object.receiptNumber, response['feesList'][feesListLength]['receiptNumber'])
        testCase.assertEqual(fee_object.amount, response['feesList'][feesListLength]['amount'])
        testCase.assertEqual(fee_object.remark, response['feesList'][feesListLength]['remark'])
        testCase.assertEqual(fee_object.generationDateTime, response['feesList'][feesListLength]['generationDateTime'])

        feesDue -= fee_object.amount
        feesDue += lateFeeAmount

        feesListLength += 1

    testCase.assertEqual(feesListLength, len(response['feesList']))

    concessionListLength = 0
    for concession_object in student_object.concession_set.all().order_by('-generationDateTime', 'id'):
        testCase.assertEqual(concession_object.id, response['concessionList'][concessionListLength]['dbId'])
        testCase.assertEqual(concession_object.amount, response['concessionList'][concessionListLength]['amount'])
        testCase.assertEqual(concession_object.remark, response['concessionList'][concessionListLength]['remark'])
        testCase.assertEqual(concession_object.generationDateTime,
                             response['concessionList'][concessionListLength]['generationDateTime'])

        feesDue -= concession_object.amount

        concessionListLength += 1

    testCase.assertEqual(concessionListLength, len(response['concessionList']))

    testCase.assertEqual(feesDue, response['feesDue'])


class CommonTestCase(ParentTestCase):

    def test_get_student_fee_data_at_least_one_fee(self):

        print(self.__str__())

        # Testing for student having atleast one fee data

        data = {}

        fee_object = Fee.objects.all()[0]

        student_object = fee_object.parentStudent

        data['studentDbId'] = student_object.id

        user_object = student_object.parentUser

        response = get_student_fee_data(data, user_object)

        common_ground(self, response, student_object)

    def test_get_student_fee_data_at_least_one_concession(self):

        print(self.__str__())

        # Testing for student having atleast one fee data

        data = {}

        concession_object = Concession.objects.all()[0]

        student_object = concession_object.parentStudent

        data['studentDbId'] = student_object.id

        user_object = student_object.parentUser

        response = get_student_fee_data(data, user_object)

        common_ground(self, response, student_object)

