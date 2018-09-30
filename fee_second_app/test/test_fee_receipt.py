from parent_test import ParentTestCase

from django.contrib.auth.models import User
from student_app.models import Student
from school_app.model.models import School

from fee_second_app.business.student_fee_status import get_student_fee_status_list
from fee_second_app.business.fee_receipt import create_fee_receipt, get_fee_receipt_by_id, \
    get_fee_receipt_list_by_student_id, get_fee_receipt_list_by_school_id, get_fee_receipt_list_by_employee_id

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
        self.assertEqual(fee_receipt_response['studentClassName'], fee_receipt_object.parentStudent.get_class_name(fee_receipt_object.parentStudent.parentSchool.currentSession))
        self.assertEqual(fee_receipt_response['receiptNumber'], fee_receipt_object.receiptNumber)
        self.assertEqual(fee_receipt_response['generationDateTime'], fee_receipt_object.generationDateTime)
        self.assertEqual(fee_receipt_response['remark'], fee_receipt_object.remark)
        self.assertEqual(fee_receipt_response['cancelled'], fee_receipt_object.cancelled)
        self.assertEqual(fee_receipt_response['parentEmployee'], fee_receipt_object.parentEmployee_id)

        sub_fee_receipt_queryset = SubFeeReceipt.objects.filter(parentFeeReceipt=fee_receipt_object).order_by('parentStudentFeeComponent__parentFeeDefinition__parentSession__orderNumber', 'parentStudentFeeComponent__parentFeeDefinition__orderNumber')

        self.assertEqual(len(fee_receipt_response['subFeeReceiptList']), sub_fee_receipt_queryset.count())

        index = 0
        for sub_fee_receipt_object in sub_fee_receipt_queryset:

            sub_fee_receipt_response = fee_receipt_response['subFeeReceiptList'][index]
            self.assertEqual(sub_fee_receipt_response['componentDbId'], sub_fee_receipt_object.parentStudentFeeComponent.id)
            self.assertEqual(sub_fee_receipt_response['feeType'], sub_fee_receipt_object.parentStudentFeeComponent.parentFeeDefinition.parentFeeType.name)
            self.assertEqual(sub_fee_receipt_response['sessionName'], sub_fee_receipt_object.parentStudentFeeComponent.parentFeeDefinition.parentSession.name)
            self.assertEqual(sub_fee_receipt_response['frequency'], sub_fee_receipt_object.parentStudentFeeComponent.parentFeeDefinition.frequency)

            if sub_fee_receipt_object.parentStudentFeeComponent.parentFeeDefinition.frequency == FeeDefinition.YEARLY_FREQUENCY:
                self.assertEqual(sub_fee_receipt_response['amount'], sub_fee_receipt_object.amount)
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

    def test_get_fee_receipt_by_school_id(self):

        fee_receipt_object = FeeReceipt.objects.all()[0]

        school_object = fee_receipt_object.parentStudent.parentSchool

        request = {}
        request['schoolDbId'] = school_object.id
        request['startDate'] = '2017-04-01'
        request['endDate'] = '2018-05-31'

        response = get_fee_receipt_list_by_school_id(request)

        fee_receipt_queryset = FeeReceipt.objects.filter(parentStudent__parentSchool=school_object,
                                                         generationDateTime__gte=request['startDate']+' 00:00:00+05:30',
                                                         generationDateTime__lte=request['endDate']+ ' 23:59:59+05:30').order_by('-generationDateTime')

        self.assertEqual(len(response), fee_receipt_queryset.count())

        index = 0
        for fee_receipt_object in fee_receipt_queryset:

            self.assertEqual(response[index]['dbId'], fee_receipt_object.id)

            index += 1

    def test_get_fee_receipt_by_employee_id(self):

        school_object = School.objects.get(name='B. Salsalai')
        employee_object = school_object.employee_set.all()[0]

        fee_receipt_object = FeeReceipt.objects.filter(parentStudent__parentSchool=school_object)[0]
        fee_receipt_object.parentEmployee_id = employee_object.id
        fee_receipt_object.save()

        request = {}
        request['parentEmployee'] = employee_object.id
        request['startDate'] = '2017-04-01'
        request['endDate'] = '2018-05-31'

        response = get_fee_receipt_list_by_employee_id(request)

        fee_receipt_queryset = FeeReceipt.objects.filter(parentEmployee_id=request['parentEmployee'],
                                                         generationDateTime__gte=request['startDate']+' 00:00:00+05:30',
                                                         generationDateTime__lte=request['endDate']+ ' 23:59:59+05:30').order_by('-generationDateTime')

        self.assertEqual(len(response), fee_receipt_queryset.count())

        index = 0
        for fee_receipt_object in fee_receipt_queryset:

            self.assertEqual(response[index]['dbId'], fee_receipt_object.id)

            index += 1

    def test_get_fee_receipt_list_by_student_id(self):

        request = {}
        request['studentDbId'] = FeeReceipt.objects.all()[0].parentStudent.id

        response = get_fee_receipt_list_by_student_id(request)

        fee_receipt_queryset = FeeReceipt.objects.filter(parentStudent_id=request['studentDbId']).order_by('-generationDateTime')

        self.assertEqual(len(response), fee_receipt_queryset.count())

        index = 0
        for fee_receipt_object in fee_receipt_queryset:

            self.assertEqual(response[index]['dbId'], fee_receipt_object.id)

            index += 1

    def test_create_fee_receipt(self):

        student_object = Student.objects.filter(parentSchool__name='Champion')[0]
        employee_object = student_object.parentSchool.employee_set.all()[0]

        student_fee_status_request = {}
        student_fee_status_request['studentDbId'] = student_object.id
        student_fee_status_list_response = get_student_fee_status_list(student_fee_status_request)

        create_fee_receipt_request = {}
        create_fee_receipt_request['studentDbId'] = student_object.id
        create_fee_receipt_request['remark'] = 'testing'
        create_fee_receipt_request['parentEmployee'] = employee_object.id
        create_fee_receipt_request['subFeeReceiptList'] = []

        for session_fee_status_response in student_fee_status_list_response:
            for component_fee_status_response in session_fee_status_response['componentList']:
                if component_fee_status_response['frequency'] == FeeDefinition.YEARLY_FREQUENCY:
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

        self.assertEqual(create_fee_receipt_response['feeReceipt']['parentEmployee'], employee_object.id)

        self.assertEqual(create_fee_receipt_response['message'], 'Fees submitted successfully')

        student_fee_status_list_response = create_fee_receipt_response['studentFeeStatusList']

        for session_fee_status_object in student_fee_status_list_response:
            for component_fee_status_object in session_fee_status_object['componentList']:
                if component_fee_status_object['frequency'] == FeeDefinition.YEARLY_FREQUENCY:
                    self.assertEqual(component_fee_status_object['amountDue'], 0)
                elif component_fee_status_object['frequency'] == FeeDefinition.MONTHLY_FREQUENCY:
                        for component_fee_status_monthly_object in component_fee_status_object['monthList']:
                            self.assertEqual(component_fee_status_monthly_object['amountDue'], 0)
