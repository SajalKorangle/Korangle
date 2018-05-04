
from django.core.exceptions import ObjectDoesNotExist

from fee_second_app.models import FeeDefinition, SubFeeReceipt, StudentFeeComponent

from student_app.models import StudentSection

from school_app.model.models import School, Session

from fee_second_app.business.student_fee_component import create_student_fee_component, \
    delete_student_monthly_fee_component, create_student_monthly_fee_component, delete_student_fee_component

'''def get_fee_definition_by_id(data):

    fee_definition_object = FeeDefinition.objects.get(id=data['dbId'])

    return get_fee_definition_by_object(fee_definition_object)'''


def get_fee_definition_by_object(fee_definition_object):

    fee_definition_response = {}

    fee_definition_response['dbId'] = fee_definition_object.id
    fee_definition_response['schoolDbId'] = fee_definition_object.parentSchool_id
    fee_definition_response['sessionDbId'] = fee_definition_object.parentSession_id
    fee_definition_response['feeTypeDbId'] = fee_definition_object.parentFeeType_id
    fee_definition_response['feeType'] = fee_definition_object.parentFeeType.name
    fee_definition_response['rte'] = fee_definition_object.rte
    fee_definition_response['onlyNewStudent'] = fee_definition_object.onlyNewStudent
    fee_definition_response['classFilter'] = fee_definition_object.classFilter
    fee_definition_response['busStopFilter'] = fee_definition_object.busStopFilter
    fee_definition_response['frequency'] = fee_definition_object.frequency

    if SubFeeReceipt.objects.filter(parentStudentFeeComponent__parentFeeDefinition=fee_definition_object).count() > 0:
        fee_definition_response['receiptExist'] = True
    else:
        fee_definition_response['receiptExist'] = False

    return fee_definition_response


def create_fee_definition(data):

    response = {}

    try:
        fee_definition_object = FeeDefinition.objects.get(parentSchool_id=data['schoolDbId'],
                                                          parentSession_id=data['sessionDbId'],
                                                          parentFeeType_id=data['feeTypeDbId'])

        response['status'] = 'fail'
        response['message'] = 'Fee Type already exists'
        response['feeDefinition'] = get_fee_definition_by_object(fee_definition_object)

        return response

    except ObjectDoesNotExist:

        fee_definition_object = FeeDefinition(parentSchool_id=data['schoolDbId'],
                                              parentSession_id=data['sessionDbId'],
                                              parentFeeType_id=data['feeTypeDbId'],
                                              orderNumber=1,
                                              rte=data['rte'],
                                              onlyNewStudent=data['onlyNewStudent'],
                                              classFilter=data['classFilter'],
                                              busStopFilter=data['busStopFilter'],
                                              frequency=data['frequency'])
        fee_definition_object.save()

        user_object = School.objects.get(id=data['schoolDbId']).user.all()[0]
        session_object = Session.objects.get(id=data['sessionDbId'])

        for student_section_object in \
                StudentSection.objects.filter(parentStudent__parentUser=user_object,
                                              parentSection__parentClassSession__parentSession=session_object):
            create_student_fee_component(student_section_object.parentStudent, fee_definition_object)

        response['status'] = 'success'
        response['message'] = 'Fee declared successfully'
        response['feeDefinition'] = get_fee_definition_by_object(fee_definition_object)

    return response


def update_fee_definition(data):

    fee_definition_object = FeeDefinition.objects.get(id=data['dbId'])

    updateStudentFeeComponent = (fee_definition_object.frequency != data['frequency'])

    fee_definition_object.rte = data['rte']
    fee_definition_object.frequency = data['frequency']
    fee_definition_object.onlyNewStudent = data['onlyNewStudent']
    fee_definition_object.classFilter = data['classFilter']
    fee_definition_object.busStopFilter = data['busStopFilter']

    fee_definition_object.save()

    if updateStudentFeeComponent:
        user_object = School.objects.get(id=data['schoolDbId']).user.all()[0]
        session_object = Session.objects.get(id=data['sessionDbId'])

        for student_section_object in \
                StudentSection.objects.filter(parentStudent__parentUser=user_object,
                                              parentSection__parentClassSession__parentSession=session_object):

            student_fee_component_object = StudentFeeComponent.objects.get(parentStudent=student_section_object.parentStudent,
                                                                           parentFeeDefinition=fee_definition_object)

            if data['frequency'] == FeeDefinition.YEARLY_FREQUENCY:
                delete_student_monthly_fee_component(student_fee_component_object)
            elif data['frequency'] == FeeDefinition.MONTHLY_FREQUENCY:
                create_student_monthly_fee_component(student_fee_component_object)

    response = {}
    response['status'] = 'success'
    response['message'] = 'Fee updated successfully'
    response['feeDefinition'] = get_fee_definition_by_object(fee_definition_object)

    return response


def delete_fee_definition(data):

    fee_definition_object = FeeDefinition.objects.get(id=data['dbId'])

    delete_student_fee_component(fee_definition_object)

    fee_definition_object.delete()

    response = {}
    response['status'] = 'success'
    response['message'] = 'Fee deleted successfully'
    response['feeDefinitionDbId'] = data['dbId']

    return response

