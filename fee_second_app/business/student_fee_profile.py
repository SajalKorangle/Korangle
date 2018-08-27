
# Business
from fee_second_app.business.student_fee_status import get_student_fee_status_list

# Models
from school_app.model.models import School, Session
from student_app.models import StudentSection


def get_student_fee_profile_list_by_school_and_session_id(data):

    student_fee_profile_list = []

    session_object = Session.objects.get(id=data['sessionDbId'])

    for student_section_object in \
            StudentSection.objects.filter(parentStudent__parentSchool_id=data['schoolDbId'],
                                          parentSection__parentClassSession__parentSession=session_object) \
                    .order_by('parentStudent__name') \
                    .select_related('parentSection__parentClassSession__parentClass',
                                    'parentStudent__currentBusStop'):
        student_fee_profile_list.append(get_student_fee_profile_by_student_section_object(student_section_object))

    return student_fee_profile_list


def get_student_fee_profile(data):

    student_section_object = \
        StudentSection.objects.get(parentStudent_id=data['studentDbId'],
                                   parentSection__parentClassSession__parentSession_id=data['sessionDbId'])

    return get_student_fee_profile_by_student_section_object(student_section_object)


def get_student_fee_profile_by_student_section_object(student_section_object):

    student_fee_profile_response = dict()

    student_fee_profile_response['name'] = student_section_object.parentStudent.name
    student_fee_profile_response['dbId'] = student_section_object.parentStudent.id
    student_fee_profile_response['fathersName'] = student_section_object.parentStudent.fathersName
    student_fee_profile_response['scholarNumber'] = student_section_object.parentStudent.scholarNumber
    student_fee_profile_response['mobileNumber'] = student_section_object.parentStudent.mobileNumber
    student_fee_profile_response['address'] = student_section_object.parentStudent.address

    if student_section_object.parentStudent.profileImage:
        student_fee_profile_response['profileImage'] = student_section_object.parentStudent.profileImage.url
    else:
        student_fee_profile_response['profileImage'] = None

    busStop = student_section_object.parentStudent.currentBusStop
    if busStop is None:
        student_fee_profile_response['stopName'] = None
    else:
        student_fee_profile_response['stopName'] = busStop.stopName

    student_fee_profile_response['className'] = student_section_object.parentSection.parentClassSession.parentClass.name
    student_fee_profile_response['sectionName'] = student_section_object.parentSection.name
    student_fee_profile_response['sectionDbId'] = student_section_object.parentSection.id
    student_fee_profile_response['rte'] = student_section_object.parentStudent.rte

    student_fee_profile_response['sessionFeeStatusList'] = \
        get_student_fee_status_list({'studentDbId': student_section_object.parentStudent.id})

    return student_fee_profile_response