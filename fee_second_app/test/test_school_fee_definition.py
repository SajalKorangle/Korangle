
from parent_test import ParentTestCase

# Models
from fee_second_app.models import FeeDefinition, FeeType, StudentFeeComponent, StudentMonthlyFeeComponent, BusStopBasedFilter
from school_app.model.models import School, BusStop
from student_app.models import StudentSection, Student

# Business
from fee_second_app.business.school_fee_definition import get_fee_definition_by_object, create_fee_definition, \
    update_fee_definition, delete_fee_definition, lock_fee_definition

# Factories
from fee_second_app.factories.fee_type import FeeTypeFactory
from fee_second_app.factories.fee_definition import FeeDefinitionFactory
from fee_second_app.factories.school_fee_component import SchoolFeeComponentFactory
from student_app.factories.student import StudentFactory


class FeeDefinitionTestCase(ParentTestCase):

    def test_get_fee_definition_by_object(self):

        fee_definition_object = FeeDefinition.objects.all()[0]

        response = get_fee_definition_by_object(fee_definition_object)

        self.assertEqual(len(response), 12)

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
        self.assertEqual(response['locked'], fee_definition_object.locked)
        self.assertEqual(response['orderNumber'], fee_definition_object.orderNumber)

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

        FeeDefinition.objects.get(parentSchool_id=data['schoolDbId'],
                                  parentSession_id=data['sessionDbId'],
                                  parentFeeType_id=data['feeTypeDbId'],
                                  rte=data['rte'],
                                  classFilter=data['classFilter'],
                                  busStopFilter=data['busStopFilter'],
                                  frequency=data['frequency'])

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

        FeeDefinition.objects.get(id=data['dbId'],
                                  parentSchool_id=data['schoolDbId'],
                                  parentSession_id=data['sessionDbId'],
                                  parentFeeType_id=data['feeTypeDbId'],
                                  rte=data['rte'],
                                  classFilter=data['classFilter'],
                                  busStopFilter=data['busStopFilter'],
                                  frequency=data['frequency'])

    def test_delete_fee_definition(self):

        fee_definition_object = FeeDefinitionFactory()

        '''for student_fee_definition_object in StudentFeeComponent.objects.all():

            if student_fee_definition_object.subconcession_set.count() == 0 & student_fee_definition_object.subconcession_set.count() == 0:

                fee_definition_object = student_fee_definition_object.parentFeeDefinition'''

        data = {
            'dbId': fee_definition_object.id
        }

        delete_fee_definition(data)

        self.assertEqual(0, FeeDefinition.objects.filter(id=data['dbId']).count())

    def test_lock_fee_definition(self):

        fee_definition_object_initial = FeeDefinitionFactory(rte=False, busStopFilter=False)

        school_fee_component_object = SchoolFeeComponentFactory(parentFeeDefinition=fee_definition_object_initial)

        StudentFactory(rte=Student.RTE_YES)

        data = {
            'dbId': fee_definition_object_initial.id
        }

        lock_fee_definition(data)

        fee_definition_object = FeeDefinition.objects.get(id=data['dbId'])

        self.assertEqual(fee_definition_object_initial.id, fee_definition_object.id)

        student_fee_component_queryset = StudentFeeComponent.objects.filter(parentFeeDefinition=fee_definition_object)

        student_queryset = Student.objects.filter(parentSchool=fee_definition_object.parentSchool)

        self.assertEqual(student_fee_component_queryset.count(), student_queryset.count())

        for student_fee_component_object in student_fee_component_queryset:
            student_object = student_fee_component_object.parentStudent
            student_section_object = \
                StudentSection.objects.get(parentStudent=student_object,
                                           parentSection__parentClassSession__parentSession=fee_definition_object.parentSession)
            class_object = student_section_object.parentSection.parentClassSession.parentClass
            if student_object.rte == Student.RTE_YES \
                    or class_object.name != 'Class - 12':
                if fee_definition_object.frequency == FeeDefinition.YEARLY_FREQUENCY:
                    self.assertEqual(student_fee_component_object.amount, 0)
                elif fee_definition_object.frequency == FeeDefinition.MONTHLY_FREQUENCY:
                    for student_monthly_fee_component_object in \
                            StudentMonthlyFeeComponent.objects.filter(parentStudentFeeComponent=student_fee_component_object):
                        self.assertEqual(student_monthly_fee_component_object.amount, 0)
            else:
                if fee_definition_object.frequency == FeeDefinition.YEARLY_FREQUENCY:
                    self.assertEqual(student_fee_component_object.amount, 1000)
                elif fee_definition_object.frequency == FeeDefinition.MONTHLY_FREQUENCY:
                    for student_monthly_fee_component_object in \
                            StudentMonthlyFeeComponent.objects.filter(parentStudentFeeComponent=student_fee_component_object):
                        self.assertEqual(student_monthly_fee_component_object.amount, 1000)
