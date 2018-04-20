
from school_app.model.models import Session

from fee_second_app.models import StudentFeeComponent, StudentMonthlyFeeComponent, FeeDefinition

def get_student_fee_status(data):

    studentDbId = int(data['studentDbId'])

    student_fee_status = {}
    student_fee_status['studentDbId'] = studentDbId

    if 'sessionDbId' in data:
        student_fee_status['feeStatus'] = get_student_fee_status_by_session_id(data['studentDbId'], data['sessionDbId'])
    else:
        student_fee_status['sessionFeeStatusList'] = []
        for session_dict in StudentFeeComponent.objects.filter(parentStudent_id=data['studentDbId'])\
                .values('parentFeeDefinition__parentSession').distinct().order_by('parentFeeDefinition__parentSession__orderNumber'):
            student_fee_status['sessionFeeStatusList']\
                .append(get_student_fee_status_by_session_id(data['studentDbId'],
                                                             session_dict['parentFeeDefinition__parentSession']))

    return student_fee_status

def get_student_fee_status_by_session_id(studentDbId, sessionDbId):

    session_object = Session.objects.get(id=sessionDbId)

    student_session_fee_status = {}
    student_session_fee_status['sessionDbId'] = session_object.id
    student_session_fee_status['sessionName'] = session_object.name
    student_session_fee_status['componentList'] = []

    for student_fee_component_object in \
            StudentFeeComponent.objects.filter(
                parentFeeDefinition__parentSession=session_object,
                parentStudent_id=studentDbId) \
                    .order_by('parentFeeDefinition__orderNumber'):
        temp_student_fee_component_status = {}

        temp_student_fee_component_status['dbId'] = student_fee_component_object.id
        temp_student_fee_component_status['feeType'] = student_fee_component_object.parentFeeDefinition.parentFeeType.name
        temp_student_fee_component_status['remark'] = student_fee_component_object.remark
        temp_student_fee_component_status['bySchoolRules'] = student_fee_component_object.bySchoolRules
        temp_student_fee_component_status['frequency'] = student_fee_component_object.parentFeeDefinition.frequency

        if student_fee_component_object.parentFeeDefinition.frequency == FeeDefinition.ANNUALLY_FREQUENCY:

            temp_student_fee_component_status['amount'] = student_fee_component_object.amount
            temp_student_fee_component_status['schoolAmount'] = student_fee_component_object.schoolAmount
            temp_student_fee_component_status['amountDue'] = student_fee_component_object.amountDue

        elif student_fee_component_object.parentFeeDefinition.frequency == FeeDefinition.MONTHLY_FREQUENCY:

            temp_student_fee_component_status['monthList'] = []
            for student_fee_component_monthly_object in StudentMonthlyFeeComponent.objects.filter(
                    parentStudentFeeComponent=student_fee_component_object).order_by('parentMonth_id'):

                temp_student_monthly_fee_status = {}
                temp_student_monthly_fee_status['month'] = student_fee_component_monthly_object.parentMonth.monthName
                temp_student_monthly_fee_status['amount'] = student_fee_component_monthly_object.amount
                temp_student_monthly_fee_status['schoolAmount'] = student_fee_component_monthly_object.schoolAmount
                temp_student_monthly_fee_status['amountDue'] = student_fee_component_monthly_object.amountDue

                temp_student_fee_component_status['monthList'].append(temp_student_monthly_fee_status)

        student_session_fee_status['componentList'].append(temp_student_fee_component_status)

    return student_session_fee_status

def create_student_fee_component(data):
    return ''


def create_or_update_student_fee_status(data):

    return ''