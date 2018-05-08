
from school_app.model.models import Session

from fee_second_app.models import StudentFeeComponent, StudentMonthlyFeeComponent, FeeDefinition


def get_student_fee_status_list(data):

    student_fee_status_list = []

    for session_dict in StudentFeeComponent.objects.filter(parentStudent_id=data['studentDbId']) \
            .values('parentFeeDefinition__parentSession').distinct().order_by('parentFeeDefinition__parentSession__orderNumber'):
        data['sessionDbId'] = session_dict['parentFeeDefinition__parentSession']
        student_fee_status_list.append(get_student_fee_status(data))

    return student_fee_status_list


def get_student_fee_status(data):

    session_object = Session.objects.get(id=data['sessionDbId'])

    student_fee_status = {}
    student_fee_status['studentDbId'] = int(data['studentDbId'])
    student_fee_status['sessionDbId'] = session_object.id
    student_fee_status['sessionName'] = session_object.name
    student_fee_status['componentList'] = []

    for student_fee_component_object in \
            StudentFeeComponent.objects.filter(
                parentFeeDefinition__parentSession=session_object,
                parentStudent_id=data['studentDbId']) \
                    .order_by('parentFeeDefinition__orderNumber'):
        temp_student_fee_component_status = {}

        temp_student_fee_component_status['dbId'] = student_fee_component_object.id
        temp_student_fee_component_status['feeType'] = student_fee_component_object.parentFeeDefinition.parentFeeType.name
        temp_student_fee_component_status['remark'] = student_fee_component_object.remark
        temp_student_fee_component_status['bySchoolRules'] = student_fee_component_object.bySchoolRules
        temp_student_fee_component_status['frequency'] = student_fee_component_object.parentFeeDefinition.frequency

        if student_fee_component_object.parentFeeDefinition.frequency == FeeDefinition.YEARLY_FREQUENCY:

            temp_student_fee_component_status['amount'] = student_fee_component_object.amount
            temp_student_fee_component_status['schoolAmount'] = student_fee_component_object.schoolAmount
            temp_student_fee_component_status['amountDue'] = student_fee_component_object.amountDue

        elif student_fee_component_object.parentFeeDefinition.frequency == FeeDefinition.MONTHLY_FREQUENCY:

            temp_student_fee_component_status['monthList'] = []
            for student_fee_component_monthly_object in StudentMonthlyFeeComponent.objects.filter(
                    parentStudentFeeComponent=student_fee_component_object).order_by('parentMonth__orderNumber'):

                temp_student_monthly_fee_status = {}
                temp_student_monthly_fee_status['month'] = student_fee_component_monthly_object.parentMonth.name
                temp_student_monthly_fee_status['amount'] = student_fee_component_monthly_object.amount
                temp_student_monthly_fee_status['schoolAmount'] = student_fee_component_monthly_object.schoolAmount
                temp_student_monthly_fee_status['amountDue'] = student_fee_component_monthly_object.amountDue

                temp_student_fee_component_status['monthList'].append(temp_student_monthly_fee_status)

        student_fee_status['componentList'].append(temp_student_fee_component_status)

    return student_fee_status


def update_student_fee_status(data):

    student_session_fee_status = data

    for student_fee_component in student_session_fee_status['componentList']:

        if student_fee_component['frequency'] == FeeDefinition.YEARLY_FREQUENCY:

            student_fee_component_object = StudentFeeComponent.objects.get(id=student_fee_component['dbId'])

            student_fee_component_object.amount = student_fee_component['amount']
            # change bySchoolRules variable too if it is not matching school amount.
            student_fee_component_object.save()

        elif student_fee_component['frequency'] == FeeDefinition.MONTHLY_FREQUENCY:

            for student_monthly_fee_component in student_fee_component['monthList']:

                student_fee_component_monthly_object = StudentMonthlyFeeComponent.objects.get(parentMonth__name=student_monthly_fee_component['month'],
                                                                                              parentStudentFeeComponent_id=student_fee_component['dbId'])
                student_fee_component_monthly_object.amount = student_monthly_fee_component['amount']
                # change bySchoolRules variable too if it is not matching school amount.
                student_fee_component_monthly_object.save()

    request = {}
    request['studentDbId'] = data['studentDbId']
    request['sessionDbId'] = student_session_fee_status['sessionDbId']

    student_session_fee_status_response = get_student_fee_status(request)

    return student_session_fee_status_response

