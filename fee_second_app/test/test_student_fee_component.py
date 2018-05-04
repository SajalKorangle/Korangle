
from parent_test import ParentTestCase

from fee_second_app.models import FeeDefinition, StudentFeeComponent, StudentMonthlyFeeComponent,\
    SubFeeReceipt, FeeReceipt, ConcessionSecond, SubConcession, Month

from student_app.models import Student

from school_app.model.models import School

from fee_second_app.business.student_fee_component import create_student_fee_component, \
    create_student_monthly_fee_component, delete_student_monthly_fee_component, delete_student_fee_component


class StudentFeeComponentTestCase(ParentTestCase):

    def test_create_student_fee_component(self):

        fee_definition_object = FeeDefinition.objects.all()[0]

        user_object = fee_definition_object.parentSchool.user.all()[0]

        student_object = Student.objects.filter(parentUser=user_object)[0]


        # Deleting Student Fee Component first starts

        student_fee_component_object = StudentFeeComponent.objects.get(parentStudent=student_object,
                                                                       parentFeeDefinition=fee_definition_object)

        for fee_receipt_object in FeeReceipt.objects.filter(parentStudent=student_object):

            for sub_fee_receipt_object in SubFeeReceipt.objects.filter(parentFeeReceipt=fee_receipt_object):

                sub_fee_receipt_object.delete()

            fee_receipt_object.delete()

        for concession_object in ConcessionSecond.objects.filter(parentStudent=student_object):

            for sub_concession_object in SubConcession.objects.filter(parentConcessionSecond=concession_object):

                sub_concession_object.delete()

            concession_object.delete()

        for student_monthly_fee_component_object in \
                StudentMonthlyFeeComponent.objects.filter(parentStudentFeeComponent=student_fee_component_object):

            student_monthly_fee_component_object.delete()

        student_fee_component_object.delete()

        # Deleting Student Fee Component first ends

        create_student_fee_component(student_object, fee_definition_object)

        student_fee_component_object = StudentFeeComponent.objects.get(parentStudent=student_object,
                                                                       parentFeeDefinition=fee_definition_object,
                                                                       amount=0)

        if fee_definition_object.frequency == FeeDefinition.MONTHLY_FREQUENCY:

            student_monthly_fee_component_queryset = \
                StudentMonthlyFeeComponent.objects.filter(parentStudentFeeComponent=student_fee_component_object)

            self.assertEqual(12, student_monthly_fee_component_queryset.count())

            for month_object in Month.objects.all().order_by('orderNumber'):

                StudentMonthlyFeeComponent.objects.get(parentStudentFeeComponent=student_fee_component_object,
                                                       parentMonth=month_object,
                                                       amount=0)

    def test_delete_student_fee_component(self):

        for student_fee_component_object in StudentFeeComponent.objects.all():

            if student_fee_component_object.subconcession_set.count() == 0 & student_fee_component_object.subfeereceipt_set.count() == 0:

                selected_student_fee_component_object = student_fee_component_object

        fee_definition_object = selected_student_fee_component_object.parentFeeDefinition

        delete_student_fee_component(selected_student_fee_component_object.parentFeeDefinition)

        self.assertEqual(0, StudentFeeComponent.objects.filter(parentFeeDefinition=fee_definition_object).count())

    def test_create_student_monthly_fee_component(self):

        student_fee_component_object = StudentFeeComponent.objects.filter(
            parentFeeDefinition__frequency=FeeDefinition.YEARLY_FREQUENCY)[0]

        create_student_monthly_fee_component(student_fee_component_object)

        student_monthly_fee_component_queryset = \
            StudentMonthlyFeeComponent.objects.filter(parentStudentFeeComponent=student_fee_component_object)

        self.assertEqual(12, student_monthly_fee_component_queryset.count())

        for month_object in Month.objects.all().order_by('orderNumber'):
            StudentMonthlyFeeComponent.objects.get(parentStudentFeeComponent=student_fee_component_object,
                                                   parentMonth=month_object,
                                                   amount=0)

    def test_delete_student_monthly_fee_component(self):

        student_fee_component_object = StudentFeeComponent.objects.filter(
            parentFeeDefinition__frequency=FeeDefinition.MONTHLY_FREQUENCY)[0]

        delete_student_monthly_fee_component(student_fee_component_object)

        student_monthly_fee_component_queryset = \
            StudentMonthlyFeeComponent.objects.filter(parentStudentFeeComponent=student_fee_component_object)

        self.assertEqual(0, student_monthly_fee_component_queryset.count())

