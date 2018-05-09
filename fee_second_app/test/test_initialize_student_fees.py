
from parent_test import ParentTestCase

# Factories
from fee_second_app.factories.school_fee_component import SchoolFeeComponentFactory
from fee_second_app.factories.fee_definition import FeeDefinitionFactory
from student_app.factories.student import StudentFactory

# Business
from fee_second_app.business.initialize_student_fees import initialize_student_fees
from fee_second_app.business.school_fee_component import get_school_fee_component_by_student_and_fee_defintion_object

# Models
from fee_second_app.models import StudentFeeComponent, FeeDefinition


class InitializeStudentFeesTestCase(ParentTestCase):

    def test_initialize_student_fees_with_school_fee_component(self):

        fee_definition_object = FeeDefinitionFactory(locked=True)
        SchoolFeeComponentFactory(parentFeeDefinition=fee_definition_object)
        student_object = StudentFactory()

        initialize_student_fees(student_object, fee_definition_object.parentSession)

        get_school_fee_component_by_student_and_fee_defintion_object(student_object, fee_definition_object)

        for fee_object in FeeDefinition.objects.filter(parentSession=fee_definition_object.parentSession,
                                                       parentSchool=fee_definition_object.parentSchool,
                                                       locked=True):
            StudentFeeComponent.objects.filter(parentStudent=student_object,
                                               parentFeeDefinition=fee_object)
