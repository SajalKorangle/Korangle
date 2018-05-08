from parent_test import ParentTestCase

from student_app.models import Student

from fee_second_app.business.student_fee_status import get_student_fee_status_list
from fee_second_app.business.concession import create_concession, get_concession_by_id, \
    get_concession_list_by_student_id, get_concession_list_by_school_id

from fee_second_app.models import FeeDefinition, ConcessionSecond, SubConcession, SubConcessionMonthly

class ConcessionTestCase(ParentTestCase):

    def test_get_concession_by_id(self):

        concession_object = ConcessionSecond.objects.all()[0]

        concession_request = {}
        concession_request['dbId'] = concession_object.id

        concession_response = get_concession_by_id(concession_request)

        self.assertEqual(concession_response['dbId'], concession_object.id)
        self.assertEqual(concession_response['studentDbId'], concession_object.parentStudent.id)
        self.assertEqual(concession_response['studentName'], concession_object.parentStudent.name)
        self.assertEqual(concession_response['studentScholarNumber'], concession_object.parentStudent.scholarNumber)
        self.assertEqual(concession_response['studentFatherName'], concession_object.parentStudent.fathersName)
        self.assertEqual(concession_response['studentClassName'], concession_object.parentStudent.get_class_name(concession_object.parentStudent.school.currentSession))
        self.assertEqual(concession_response['generationDateTime'], concession_object.generationDateTime)
        self.assertEqual(concession_response['remark'], concession_object.remark)
        self.assertEqual(concession_response['cancelled'], concession_object.cancelled)

        sub_concession_queryset = SubConcession.objects.filter(parentConcessionSecond=concession_object).order_by('parentStudentFeeComponent__parentFeeDefinition__parentSession__orderNumber', 'parentStudentFeeComponent__parentFeeDefinition__orderNumber')

        self.assertEqual(len(concession_response['subConcessionList']), sub_concession_queryset.count())

        index = 0
        for sub_concession_object in sub_concession_queryset:

            sub_concession_response = concession_response['subConcessionList'][index]
            self.assertEqual(sub_concession_response['amount'], sub_concession_object.amount)
            self.assertEqual(sub_concession_response['componentDbId'], sub_concession_object.parentStudentFeeComponent.id)
            self.assertEqual(sub_concession_response['feeType'], sub_concession_object.parentStudentFeeComponent.parentFeeDefinition.parentFeeType.name)
            self.assertEqual(sub_concession_response['sessionName'], sub_concession_object.parentStudentFeeComponent.parentFeeDefinition.parentSession.name)
            self.assertEqual(sub_concession_response['frequency'], sub_concession_object.parentStudentFeeComponent.parentFeeDefinition.frequency)

            if sub_concession_object.parentStudentFeeComponent.parentFeeDefinition.frequency == FeeDefinition.MONTHLY_FREQUENCY:

                sub_concession_monthly_queryset = SubConcessionMonthly.objects.filter(parentSubConcession=sub_concession_object)

                self.assertEqual(len(sub_concession_response['monthList']), sub_concession_monthly_queryset.count())

                secondIndex = 0
                for sub_concession_monthly_object in sub_concession_monthly_queryset:

                    sub_concession_monthly_response = sub_concession_response['montList'][secondIndex]
                    self.assertEqual(sub_concession_monthly_response['month'], sub_concession_monthly_object.parentMonth.name)
                    self.assertEqual(sub_concession_monthly_response['amount'], sub_concession_monthly_object.amount)

                    secondIndex += 1

            index += 1

    def test_get_concession_by_school_id(self):

        concession_object = ConcessionSecond.objects.all()[0]

        user_object = concession_object.parentStudent.parentUser

        request = {}
        request['schoolDbId'] = user_object.school_set.all()[0].id
        request['startDate'] = '2017-04-01'
        request['endDate'] = '2018-05-31'

        response = get_concession_list_by_school_id(request)

        concession_queryset = ConcessionSecond.objects.filter(parentStudent__parentUser=user_object,
                                                         generationDateTime__gte=request['startDate']+' 00:00:00+05:30',
                                                         generationDateTime__lte=request['endDate']+ ' 23:59:59+05:30').order_by('-generationDateTime')

        self.assertEqual(len(response), concession_queryset.count())

        index = 0
        for concession_object in concession_queryset:

            self.assertEqual(response[index]['dbId'], concession_object.id)

            index += 1

    def test_get_concession_list_by_student_id(self):

        request = {}
        request['studentDbId'] = ConcessionSecond.objects.all()[0].parentStudent.id

        response = get_concession_list_by_student_id(request)

        concession_queryset = ConcessionSecond.objects.filter(parentStudent_id=request['studentDbId']).order_by('-generationDateTime')

        self.assertEqual(len(response), concession_queryset.count())

        index = 0
        for concession_object in concession_queryset:

            self.assertEqual(response[index]['dbId'], concession_object.id)

            index += 1

    def test_create_concession(self):

        student_object = Student.objects.filter(parentUser__username='champion')[0]

        student_fee_status_request = {}
        student_fee_status_request['studentDbId'] = student_object.id
        student_fee_status_list_response = get_student_fee_status_list(student_fee_status_request)

        create_concession_request = {}
        create_concession_request['studentDbId'] = student_object.id
        create_concession_request['remark'] = 'testing'
        create_concession_request['subConcessionList'] = []

        for session_fee_status_response in student_fee_status_list_response:
            for component_fee_status_response in session_fee_status_response['componentList']:
                if component_fee_status_response['frequency'] == FeeDefinition.YEARLY_FREQUENCY:
                    if component_fee_status_response['amountDue'] > 0:
                        subConcession = {}
                        subConcession['amount'] = component_fee_status_response['amountDue']
                        subConcession['componentDbId'] = component_fee_status_response['dbId']
                        subConcession['frequency'] = component_fee_status_response['frequency']
                        subConcession['feeType'] = component_fee_status_response['feeType']
                        create_concession_request['subConcessionList'].append(subConcession)
                elif component_fee_status_response['frequency'] == FeeDefinition.MONTHLY_FREQUENCY:
                    amountDue = 0
                    subConcession = {}
                    subConcession['componentDbId'] = component_fee_status_response['dbId']
                    subConcession['frequency'] = component_fee_status_response['frequency']
                    subConcession['feeType'] = component_fee_status_response['feeType']
                    subConcession['monthList'] = []
                    for component_fee_status_monthly_response in component_fee_status_response['monthList']:
                        subConcessionMonthly = {}
                        subConcessionMonthly['month'] = component_fee_status_monthly_response['month']
                        subConcessionMonthly['amount'] = component_fee_status_monthly_response['amountDue']
                        amountDue += component_fee_status_monthly_response['amountDue']
                        subConcession['monthList'].append(subConcessionMonthly)
                    if amountDue > 0:
                        subConcession['amount'] = amountDue
                        create_concession_request['subConcessionList'].append(subConcession)

        create_concession_response = create_concession(create_concession_request)

        self.assertEqual(create_concession_response['message'], 'Concession given successfully')

        student_fee_status_list_response = create_concession_response['studentFeeStatusList']

        for session_fee_status_object in student_fee_status_list_response:
            for component_fee_status_object in session_fee_status_object['componentList']:
                if component_fee_status_object['frequency'] == FeeDefinition.YEARLY_FREQUENCY:
                    self.assertEqual(component_fee_status_object['amountDue'], 0)
                elif component_fee_status_object['frequency'] == FeeDefinition.MONTHLY_FREQUENCY:
                        for component_fee_status_monthly_object in component_fee_status_object['monthList']:
                            self.assertEqual(component_fee_status_monthly_object['amountDue'], 0)
