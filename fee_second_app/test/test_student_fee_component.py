
from parent_test import ParentTestCase

# Models
from fee_second_app.models import FeeDefinition, StudentFeeComponent, StudentMonthlyFeeComponent, \
    SchoolMonthlyFeeComponent, Month

# Factories
from fee_second_app.factories.school_fee_component import SchoolFeeComponentFactory
from fee_second_app.factories.fee_definition import FeeDefinitionFactory
from student_app.factories.student import StudentFactory

# Business
from fee_second_app.business.student_fee_component import create_student_fee_component


class StudentFeeComponentTestCase(ParentTestCase):

    def test_create_student_fee_component_with_school_value(self):

        school_fee_component_object = SchoolFeeComponentFactory()

        student_object = StudentFactory()

        fee_definition_object = school_fee_component_object.parentFeeDefinition

        create_student_fee_component(student_object, fee_definition_object, school_fee_component_object)

        if fee_definition_object.frequency == FeeDefinition.YEARLY_FREQUENCY:
            StudentFeeComponent.objects.get(parentStudent=student_object,
                                            parentFeeDefinition=fee_definition_object,
                                            amount=school_fee_component_object.amount)
        elif fee_definition_object.frequency == FeeDefinition.MONTHLY_FREQUENCY:
            student_fee_component_object = StudentFeeComponent.objects.get(parentStudent=student_object,
                                                                           parentFeeDefinition=fee_definition_object)
            school_monthly_fee_component_queryset = \
                SchoolMonthlyFeeComponent.objects.filter(parentSchoolFeeComponent=school_fee_component_object)
            self.assertEqual(12,school_monthly_fee_component_queryset.count())
            for school_monthly_fee_component_object in school_monthly_fee_component_queryset:
                StudentMonthlyFeeComponent.objects.get(parentStudentFeeComponent=student_fee_component_object,
                                                       parentMonth=school_monthly_fee_component_object.parentMonth,
                                                       amount=school_monthly_fee_component_object.amount)

    def test_create_student_fee_component_with_none(self):

        student_object = StudentFactory()

        fee_definition_object = FeeDefinitionFactory()

        create_student_fee_component(student_object, fee_definition_object, None)

        if fee_definition_object.frequency == FeeDefinition.YEARLY_FREQUENCY:
            StudentFeeComponent.objects.get(parentStudent=student_object,
                                            parentFeeDefinition=fee_definition_object,
                                            amount=0)
        elif fee_definition_object.frequency == FeeDefinition.MONTHLY_FREQUENCY:
            student_fee_component_object = StudentFeeComponent.objects.get(parentStudent=student_object,
                                                                           parentFeeDefinition=fee_definition_object)
            for month_object in Month.objects.all():
                StudentMonthlyFeeComponent.objects.get(parentStudentFeeComponent=student_fee_component_object,
                                                       parentMonth=month_object,
                                                       amount=0)

