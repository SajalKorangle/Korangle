
from fee_second_app.models import FeeDefinition, StudentFeeComponent, StudentMonthlyFeeComponent, \
    Month, SchoolMonthlyFeeComponent

from fee_second_app.business.student_fee_dues import update_student_fee_dues


def create_student_fee_component(student_object, fee_definition_object, school_fee_component_object):

    if school_fee_component_object is None:

        if fee_definition_object.frequency == FeeDefinition.YEARLY_FREQUENCY:
            student_fee_component_object = StudentFeeComponent(parentStudent=student_object,
                                                               parentFeeDefinition=fee_definition_object,
                                                               amount=0)
            student_fee_component_object.save()

        elif fee_definition_object.frequency == FeeDefinition.MONTHLY_FREQUENCY:
            student_fee_component_object = StudentFeeComponent(parentStudent=student_object,
                                                               parentFeeDefinition=fee_definition_object)
            student_fee_component_object.save()
            for month_object in Month.objects.all():
                student_monthly_fee_component_object = \
                    StudentMonthlyFeeComponent(parentStudentFeeComponent=student_fee_component_object,
                                               parentMonth=month_object)
                student_monthly_fee_component_object.save()

    else:

        if fee_definition_object.frequency == FeeDefinition.YEARLY_FREQUENCY:
            student_fee_component_object = StudentFeeComponent(parentStudent=student_object,
                                                               parentFeeDefinition=fee_definition_object,
                                                               amount=school_fee_component_object.amount)
            student_fee_component_object.save()

        elif fee_definition_object.frequency == FeeDefinition.MONTHLY_FREQUENCY:
            student_fee_component_object = StudentFeeComponent(parentStudent=student_object,
                                                               parentFeeDefinition=fee_definition_object)
            student_fee_component_object.save()
            for school_monthly_fee_component_object in \
                    SchoolMonthlyFeeComponent.objects.filter(parentSchoolFeeComponent=school_fee_component_object):
                student_monthly_fee_component_object = \
                    StudentMonthlyFeeComponent(parentStudentFeeComponent=student_fee_component_object,
                                               parentMonth=school_monthly_fee_component_object.parentMonth,
                                               amount=school_monthly_fee_component_object.amount)
                student_monthly_fee_component_object.save()

    update_student_fee_dues(student_object)
