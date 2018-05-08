
from django.core.exceptions import ObjectDoesNotExist

# Models
from fee_second_app.models import FeeDefinition, FeeType
from student_app.models import StudentSection

# Business
from fee_second_app.business.student_fee_component import create_student_fee_component
from fee_second_app.business.school_fee_component import get_school_fee_component_by_student_and_fee_defintion_object


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
    fee_definition_response['locked'] = fee_definition_object.locked
    fee_definition_response['orderNumber'] = fee_definition_object.orderNumber

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

        fee_type_object = FeeType.objects.get(id=data['feeTypeDbId'])

        fee_definition_object = FeeDefinition(parentSchool_id=data['schoolDbId'],
                                              parentSession_id=data['sessionDbId'],
                                              parentFeeType_id=data['feeTypeDbId'],
                                              orderNumber=fee_type_object.orderNumber,
                                              rte=data['rte'],
                                              onlyNewStudent=data['onlyNewStudent'],
                                              classFilter=data['classFilter'],
                                              busStopFilter=data['busStopFilter'],
                                              frequency=data['frequency'])
        fee_definition_object.save()

        response['status'] = 'success'
        response['message'] = 'Fee declared successfully'
        response['feeDefinition'] = get_fee_definition_by_object(fee_definition_object)

    return response


def update_fee_definition(data):

    fee_definition_object = FeeDefinition.objects.get(id=data['dbId'])

    # updateStudentFeeComponent = (fee_definition_object.frequency != data['frequency'])

    fee_definition_object.rte = data['rte']
    fee_definition_object.frequency = data['frequency']
    fee_definition_object.onlyNewStudent = data['onlyNewStudent']
    fee_definition_object.classFilter = data['classFilter']
    fee_definition_object.busStopFilter = data['busStopFilter']

    fee_definition_object.save()

    response = {}
    response['status'] = 'success'
    response['message'] = 'Fee updated successfully'
    response['feeDefinition'] = get_fee_definition_by_object(fee_definition_object)

    return response


def delete_fee_definition(data):

    fee_definition_object = FeeDefinition.objects.get(id=data['dbId'])

    # delete_student_fee_component(fee_definition_object)

    fee_definition_object.delete()

    response = {}
    response['status'] = 'success'
    response['message'] = 'Fee deleted successfully'
    response['feeDefinitionDbId'] = int(data['dbId'])

    return response


def lock_fee_definition(data):

    fee_definition_object = FeeDefinition.objects.get(id=data['dbId'])

    user_object = fee_definition_object.parentSchool.user.all()[0]
    session_object = fee_definition_object.parentSession

    for student_section_object in \
            StudentSection.objects.filter(parentStudent__parentUser=user_object,
                                          parentSection__parentClassSession__parentSession=session_object):

        student_object = student_section_object.parentStudent

        school_fee_component_object = \
            get_school_fee_component_by_student_and_fee_defintion_object(student_object, fee_definition_object)

        create_student_fee_component(student_object, fee_definition_object, school_fee_component_object)

        '''# check rte constraint
        if (fee_definition_object.rte is False) & (student_object.rte == Student.RTE_YES):
            create_student_fee_component(student_object, fee_definition_object, None)
            continue

        # check only new student constraint
            # Need new field 'Admission session' in student profile for this to work

        # find student fee component by defined filters

        school_fee_component_queryset = SchoolFeeComponent.objects.filter(parentFeeDefinition=fee_definition_object)

        if fee_definition_object.classFilter:
            class_object = student_section_object.parentSection.parentClassSession.parentClass
            for school_fee_component_object in school_fee_component_queryset:
                if school_fee_component_object.classbasedfilter_set.filter(parentClass=class_object).count() == 0:
                    school_fee_component_queryset = school_fee_component_queryset.exclude(id=school_fee_component_object.id)

        if fee_definition_object.busStopFilter:
            bus_stop_object = student_object.currentBusStop
            for school_fee_component_object in school_fee_component_queryset:
                if school_fee_component_object.busstopbasedfilter_set.filter(parentBusStop=bus_stop_object).count() == 0:
                    school_fee_component_queryset = school_fee_component_queryset.exclude(id=school_fee_component_object.id)

        if school_fee_component_queryset.count() == 0:
            create_student_fee_component(student_object, fee_definition_object, None)
        elif school_fee_component_queryset.count() == 1:
            create_student_fee_component(student_object, fee_definition_object, school_fee_component_queryset[0])
        else:
            raise ValueError('More than one school fee component for a student')
            return 'Error: Contact Admin'''

    fee_definition_object.locked = True
    fee_definition_object.save()

    return 'Fee locked successfully'
