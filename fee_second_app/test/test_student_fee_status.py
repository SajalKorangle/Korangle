from parent_test import ParentTestCase

from django.db.models import Sum

from student_app.models import Student

from school_app.model.models import Session

from fee_second_app.business.student_fee_status import get_student_fee_status, get_student_fee_status_by_session_id

from fee_second_app.models import FeeDefinition, StudentFeeComponent, StudentFeeComponentMonthly, SubFeeReceipt, SubConcession

class StudentFeeStatusTestCase(ParentTestCase):

    def test_get_student_fee_status_for_given_session(self):

        data = {}
        data['studentDbId'] = Student.objects.all()[0].id
        data['sessionDbId'] = Session.objects.all()[0].id

        response = get_student_fee_status(data)

        self.assertEqual(response['studentDbId'], data['studentDbId'])
        self.assertEqual('feeStatus' in response, True)

    def test_get_student_fee_status_for_all_sessions(self):

        data = {}
        data['studentDbId'] = Student.objects.all()[0].id

        response = get_student_fee_status(data)

        self.assertEqual(response['studentDbId'], data['studentDbId'])

        session_queryset = StudentFeeComponent.objects.filter(parentStudent_id=data['studentDbId'])\
                .values('parentFeeDefinition__parentSession').distinct().order_by('parentFeeDefinition__parentSession__orderNumber')

        self.assertEqual(len(response['sessionFeeStatusList']), session_queryset.count())

        sessionIndexCounter = 0
        for session_value in session_queryset:
            self.assertEqual(response['sessionFeeStatusList'][sessionIndexCounter]['sessionDbId'],
                             session_value['parentFeeDefinition__parentSession'])
            sessionIndexCounter += 1

    def test_get_student_fee_status_by_session_id(self):

        data = {}
        data['studentDbId'] = Student.objects.all()[0].id
        data['sessionDbId'] = Session.objects.all()[0].id

        response = get_student_fee_status_by_session_id(data['studentDbId'], data['sessionDbId'])

        self.assertEqual(response['sessionDbId'], data['sessionDbId'])
        self.assertEqual(response['sessionName'], Session.objects.get(id=data['sessionDbId']).name)

        student_fee_component_queryset = \
            StudentFeeComponent.objects.filter(parentStudent_id=data['studentDbId'],
                                               parentFeeDefinition__parentSession_id=data['sessionDbId'])

        self.assertEqual(len(response['componentList']), student_fee_component_queryset.count())

        indexCounter = 0
        for student_fee_component_object in student_fee_component_queryset.order_by('parentFeeDefinition__orderNumber'):

            self.assertEqual(response['componentList'][indexCounter]['dbId'], student_fee_component_object.id)
            self.assertEqual(response['componentList'][indexCounter]['feeType'], student_fee_component_object.parentFeeDefinition.parentFeeType.name)
            self.assertEqual(response['componentList'][indexCounter]['remark'], student_fee_component_object.remark)
            self.assertEqual(response['componentList'][indexCounter]['bySchoolRules'], student_fee_component_object.bySchoolRules)

            self.assertEqual(response['componentList'][indexCounter]['frequency'], student_fee_component_object.parentFeeDefinition.frequency)

            if student_fee_component_object.parentFeeDefinition.frequency == FeeDefinition.ANNUALLY_FREQUENCY:

                self.assertEqual(response['componentList'][indexCounter]['amount'], student_fee_component_object.amount)
                self.assertEqual(response['componentList'][indexCounter]['schoolAmount'], student_fee_component_object.schoolAmount)
                self.assertEqual(response['componentList'][indexCounter]['amountDue'],student_fee_component_object.amountDue)

            elif student_fee_component_object.parentFeeDefinition.frequency == FeeDefinition.MONTHLY_FREQUENCY:

                student_monthly_fee_component_queryset = \
                    StudentFeeComponentMonthly.objects.filter(parentStudentFeeComponent=student_fee_component_object)

                self.assertEqual(len(response['componentList'][indexCounter]['monthList']), student_monthly_fee_component_queryset.count())

                monthIndexCounter = 0
                for student_monthly_fee_component_object in student_monthly_fee_component_queryset.order_by('parentMonth_id'):
                    self.assertEqual(response['componentList'][indexCounter]['monthList'][monthIndexCounter]['month'],
                                     student_monthly_fee_component_object.parentMonth.monthName)
                    self.assertEqual(response['componentList'][indexCounter]['monthList'][monthIndexCounter]['amount'],
                                     student_monthly_fee_component_object.amount)
                    self.assertEqual(response['componentList'][indexCounter]['monthList'][monthIndexCounter]['schoolAmount'],
                                     student_monthly_fee_component_object.schoolAmount)
                    self.assertEqual(response['componentList'][indexCounter]['monthList'][monthIndexCounter]['amountDue'],
                                     student_monthly_fee_component_object.amountDue)
                    monthIndexCounter += 1

            indexCounter += 1
