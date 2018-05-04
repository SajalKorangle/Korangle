
from parent_test import ParentTestCase

from fee_second_app.models import FeeDefinition, FeeType, StudentFeeComponent, SubFeeReceipt, StudentMonthlyFeeComponent
from school_app.model.models import School, Session
from student_app.models import StudentSection

from fee_second_app.business.school_fee_definition import get_fee_definition_by_object, create_fee_definition, \
    update_fee_definition, delete_fee_definition


class FeeDefinitionTestCase(ParentTestCase):

    def test_get_fee_definition_by_object(self):

        fee_definition_object = FeeDefinition.objects.all()[0]

        response = get_fee_definition_by_object(fee_definition_object)

        self.assertEqual(len(response), 11)

        self.assertEqual(response['dbId'], fee_definition_object.id)
        self.assertEqual(response['schoolDbId'], fee_definition_object.parentSchool_id)
        self.assertEqual(response['sessionDbId'], fee_definition_object.parentSession_id)
        self.assertEqual(response['feeTypeDbId'], fee_definition_object.parentFeeType_id)
        self.assertEqual(response['feeType'], fee_definition_object.parentFeeType.name)
        self.assertEqual(response['rte'], fee_definition_object.rte)
        self.assertEqual(response['onlyNewStudent'], fee_definition_object.onlyNewStudent)
        self.assertEqual(response['classFilter'], fee_definition_object.classFilter)
        self.assertEqual(response['busStopFilter'], fee_definition_object.busStopFilter)
        self.assertEqual(response['frequency'], fee_definition_object.frequency)

        if SubFeeReceipt.objects.filter(parentStudentFeeComponent__parentFeeDefinition=fee_definition_object).count():
            self.assertEqual(response['receiptExist'], True)
        else:
            self.assertEqual(response['receiptExist'], False)

    def test_create_fee_definition(self):

        school_id = School.objects.filter(name='BRIGHT STAR')[0].id
        fee_type_object = FeeType.objects.get(name='Tuition Fee')

        data = {
            'schoolDbId': school_id,
            'sessionDbId': 1,
            'feeTypeDbId': fee_type_object.id,
            'feeType': fee_type_object.name,
            'rte': False,
            'onlyNewStudent': False,
            'classFilter': True,
            'busStopFilter': False,
            'frequency': 'YEARLY',
        }

        create_fee_definition(data)

        fee_definition_object = FeeDefinition.objects.get(parentSchool_id=data['schoolDbId'],
                                                          parentSession_id=data['sessionDbId'],
                                                          parentFeeType_id=data['feeTypeDbId'],
                                                          rte=data['rte'],
                                                          classFilter=data['classFilter'],
                                                          busStopFilter=data['busStopFilter'],
                                                          frequency=data['frequency'])

        user_object = School.objects.get(id=data['schoolDbId']).user.all()[0]

        for student_section_object in StudentSection.objects.filter(parentStudent__parentUser=user_object,parentSection__parentClassSession__parentSession_id=data['sessionDbId']):

            StudentFeeComponent.objects.get(parentStudent=student_section_object.parentStudent,
                                            parentFeeDefinition=fee_definition_object)

    def test_update_fee_definition(self):

        fee_definition_object = FeeDefinition.objects.all()[0]

        school_id = fee_definition_object.parentSchool.id
        fee_type_object = fee_definition_object.parentFeeType

        data = {
            'dbId': fee_definition_object.id,
            'schoolDbId': school_id,
            'sessionDbId': 1,
            'feeTypeDbId': fee_type_object.id,
            'feeType': fee_type_object.name,
            'rte': False,
            'onlyNewStudent': False,
            'classFilter': True,
            'busStopFilter': False,
            'frequency': 'YEARLY',
        }

        if fee_definition_object.frequency == FeeDefinition.MONTHLY_FREQUENCY:
            data['frequency'] = FeeDefinition.YEARLY_FREQUENCY
        elif fee_definition_object.frequency == FeeDefinition.YEARLY_FREQUENCY:
            data['frequency'] = FeeDefinition.MONTHLY_FREQUENCY

        update_fee_definition(data)

        fee_definition_object = FeeDefinition.objects.get(id=data['dbId'],
                                                          parentSchool_id=data['schoolDbId'],
                                                          parentSession_id=data['sessionDbId'],
                                                          parentFeeType_id=data['feeTypeDbId'],
                                                          rte=data['rte'],
                                                          classFilter=data['classFilter'],
                                                          busStopFilter=data['busStopFilter'],
                                                          frequency=data['frequency'])

        user_object = School.objects.get(id=data['schoolDbId']).user.all()[0]

        for student_section_object in StudentSection.objects.filter(parentStudent__parentUser=user_object,
                                                                    parentSection__parentClassSession__parentSession_id=data['sessionDbId']):

            student_fee_component_object = StudentFeeComponent.objects.get(parentStudent=student_section_object.parentStudent,
                                                                           parentFeeDefinition=fee_definition_object)

            if data['frequency'] == FeeDefinition.MONTHLY_FREQUENCY:
                self.assertEqual(12, StudentMonthlyFeeComponent.objects.filter(
                    parentStudentFeeComponent=student_fee_component_object).count())
            if data['frequency'] == FeeDefinition.YEARLY_FREQUENCY:
                self.assertEqual(0, StudentMonthlyFeeComponent.objects.filter(
                    parentStudentFeeComponent=student_fee_component_object).count())

    def test_delete_fee_definition(self):

        for student_fee_definition_object in StudentFeeComponent.objects.all():

            if student_fee_definition_object.subconcession_set.count() == 0 & student_fee_definition_object.subconcession_set.count() == 0:

                fee_definition_object = student_fee_definition_object.parentFeeDefinition

        data = {
            'dbId': fee_definition_object.id
        }

        delete_fee_definition(data)

        self.assertEqual(0, FeeDefinition.objects.filter(id=data['dbId']).count())
