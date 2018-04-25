from parent_test import ParentTestCase

from student_app.models import Student

from fee_second_app.business.student_fee_status import get_student_fee_status
from fee_second_app.business.fee_receipt import create_fee_receipt, get_fee_receipt_by_id

from fee_second_app.models import FeeDefinition, FeeReceipt, SubFeeReceipt, SubFeeReceiptMonthly

class FeeReceiptTestCase(ParentTestCase):

    def test_get_fee_receipt_by_id(self):

        fee_receipt_object = FeeReceipt.objects.all()[0]

        fee_receipt_request = {}
        fee_receipt_request['dbId'] = fee_receipt_object.id

        fee_receipt_response = get_fee_receipt_by_id(fee_receipt_request)

        self.assertEqual(fee_receipt_response['dbId'], fee_receipt_object.id)
        self.assertEqual(fee_receipt_response['studentDbId'], fee_receipt_object.parentStudent.id)
        self.assertEqual(fee_receipt_response['studentName'], fee_receipt_object.parentStudent.name)
        self.assertEqual(fee_receipt_response['studentScholarNumber'], fee_receipt_object.parentStudent.scholarNumber)
        self.assertEqual(fee_receipt_response['studentFatherName'], fee_receipt_object.parentStudent.fathersName)
        self.assertEqual(fee_receipt_response['studentClassName'], fee_receipt_object.parentStudent.get_class_name(fee_receipt_object.parentStudent.school.currentSession))
        self.assertEqual(fee_receipt_response['receiptNumber'], fee_receipt_object.receiptNumber)
        self.assertEqual(fee_receipt_response['generationDateTime'], fee_receipt_object.generationDateTime)
        self.assertEqual(fee_receipt_response['remark'], fee_receipt_object.remark)

        sub_fee_receipt_queryset = SubFeeReceipt.objects.filter(parentFeeReceipt=fee_receipt_object).order_by('parentStudentFeeComponent__parentFeeDefinition__parentSession__orderNumber', 'parentStudentFeeComponent__parentFeeDefinition__orderNumber')

        self.assertEqual(len(fee_receipt_response['subFeeReceiptList']), sub_fee_receipt_queryset.count())

        index = 0
        for sub_fee_receipt_object in sub_fee_receipt_queryset:

            sub_fee_receipt_response = fee_receipt_response['subFeeReceiptList'][index]
            self.assertEqual(sub_fee_receipt_response['amount'], sub_fee_receipt_object.amount)
            self.assertEqual(sub_fee_receipt_response['componentDbId'], sub_fee_receipt_object.parentStudentFeeComponent.id)
            self.assertEqual(sub_fee_receipt_response['feeType'], sub_fee_receipt_object.parentStudentFeeComponent.parentFeeDefinition.parentFeeType.name)
            self.assertEqual(sub_fee_receipt_response['sessionName'], sub_fee_receipt_object.parentStudentFeeComponent.parentFeeDefinition.parentSession.name)
            self.assertEqual(sub_fee_receipt_response['frequency'], sub_fee_receipt_object.parentStudentFeeComponent.parentFeeDefinition.frequency)

            if sub_fee_receipt_object.parentStudentFeeComponent.parentFeeDefinition.frequency == FeeDefinition.MONTHLY_FREQUENCY:

                sub_fee_receipt_monthly_queryset = SubFeeReceiptMonthly.objects.filter(parentSubFeeReceipt=sub_fee_receipt_object)

                self.assertEqual(len(sub_fee_receipt_response['monthList']), sub_fee_receipt_monthly_queryset.count())

                secondIndex = 0
                for sub_fee_receipt_monthly_object in sub_fee_receipt_monthly_queryset:

                    sub_fee_receipt_monthly_response = sub_fee_receipt_response['montList'][secondIndex]
                    self.assertEqual(sub_fee_receipt_monthly_response['month'], sub_fee_receipt_monthly_object.parentMonth.name)
                    self.assertEqual(sub_fee_receipt_monthly_response['amount'], sub_fee_receipt_monthly_object.amount)

                    secondIndex += 1

            index += 1


    def test_create_fee_receipt(self):

        student_object = Student.objects.filter(parentUser__username='champion')[0]

        student_fee_status_request = {}
        student_fee_status_request['studentDbId'] = student_object.id
        student_fee_status_response = get_student_fee_status(student_fee_status_request)

        create_fee_receipt_request = {}
        create_fee_receipt_request['studentDbId'] = student_object.id
        create_fee_receipt_request['remark'] = 'testing'
        create_fee_receipt_request['subFeeReceiptList'] = []

        for session_fee_status_response in student_fee_status_response['sessionFeeStatusList']:
            for component_fee_status_response in session_fee_status_response['componentList']:
                if component_fee_status_response['frequency'] == FeeDefinition.ANNUALLY_FREQUENCY:
                    if component_fee_status_response['amountDue'] > 0:
                        subFeeReceipt = {}
                        subFeeReceipt['amount'] = component_fee_status_response['amountDue']
                        subFeeReceipt['componentDbId'] = component_fee_status_response['dbId']
                        subFeeReceipt['frequency'] = component_fee_status_response['frequency']
                        subFeeReceipt['feeType'] = component_fee_status_response['feeType']
                        create_fee_receipt_request['subFeeReceiptList'].append(subFeeReceipt)
                elif component_fee_status_response['frequency'] == FeeDefinition.MONTHLY_FREQUENCY:
                    amountDue = 0
                    subFeeReceipt = {}
                    subFeeReceipt['componentDbId'] = component_fee_status_response['dbId']
                    subFeeReceipt['frequency'] = component_fee_status_response['frequency']
                    subFeeReceipt['feeType'] = component_fee_status_response['feeType']
                    subFeeReceipt['monthList'] = []
                    for component_fee_status_monthly_response in component_fee_status_response['monthList']:
                        subFeeReceiptMonthly = {}
                        subFeeReceiptMonthly['month'] = component_fee_status_monthly_response['month']
                        subFeeReceiptMonthly['amount'] = component_fee_status_monthly_response['amountDue']
                        amountDue += component_fee_status_monthly_response['amountDue']
                        subFeeReceipt['monthList'].append(subFeeReceiptMonthly)
                    if amountDue > 0:
                        subFeeReceipt['amount'] = amountDue
                        create_fee_receipt_request['subFeeReceiptList'].append(subFeeReceipt)

        create_fee_receipt_response = create_fee_receipt(create_fee_receipt_request)

        self.assertEqual(create_fee_receipt_response['message'], 'Fees submitted successfully')

        student_fee_status_response = create_fee_receipt_response['studentFeeStatus']

        for session_fee_status_object in student_fee_status_response['sessionFeeStatusList']:
            for component_fee_status_object in session_fee_status_object['componentList']:
                if component_fee_status_object['frequency'] == FeeDefinition.ANNUALLY_FREQUENCY:
                    self.assertEqual(component_fee_status_object['amountDue'], 0)
                elif component_fee_status_object['frequency'] == FeeDefinition.MONTHLY_FREQUENCY:
                        for component_fee_status_monthly_object in component_fee_status_object['monthList']:
                            self.assertEqual(component_fee_status_monthly_object['amountDue'], 0)
