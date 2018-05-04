
from fee_second_app.models import StudentFeeComponent, FeeDefinition, StudentMonthlyFeeComponent, Month


def create_student_fee_component(student_object, fee_definition_object):

    student_fee_component_object = StudentFeeComponent(parentStudent=student_object,
                                                       parentFeeDefinition=fee_definition_object,
                                                       amount=0,
                                                       bySchoolRules=True,
                                                       remark='')
    student_fee_component_object.save()

    if fee_definition_object.frequency == FeeDefinition.MONTHLY_FREQUENCY:

        for month_object in Month.objects.all().order_by('orderNumber'):

            student_monthly_fee_component_object = \
                StudentMonthlyFeeComponent(parentStudentFeeComponent=student_fee_component_object,
                                           parentMonth=month_object,
                                           amount=0)
            student_monthly_fee_component_object.save()


def delete_student_fee_component(fee_definition_object):

    for student_fee_component_object in StudentFeeComponent.objects.filter(parentFeeDefinition=fee_definition_object):

        delete_student_monthly_fee_component(student_fee_component_object)
        student_fee_component_object.delete()


def create_student_monthly_fee_component(student_fee_component_object):

    for month_object in Month.objects.all().order_by('orderNumber'):

        student_monthly_fee_component_object = \
            StudentMonthlyFeeComponent(parentStudentFeeComponent=student_fee_component_object,
                                       parentMonth=month_object,
                                       amount=0)
        student_monthly_fee_component_object.save()


def delete_student_monthly_fee_component(student_fee_component_object):

    StudentMonthlyFeeComponent.objects.filter(parentStudentFeeComponent=student_fee_component_object).delete()

