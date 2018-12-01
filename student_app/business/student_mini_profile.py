
# Models
from student_app.models import StudentSection


def get_student_mini_profile(student_section_object):

    student_object = student_section_object.parentStudent

    student_response = dict()
    student_response['name'] = student_object.name
    student_response['scholarNumber'] = student_object.scholarNumber
    student_response['fathersName'] = student_object.fathersName
    student_response['dbId'] = student_object.id

    if student_object.profileImage:
        student_response['profileImage'] = student_object.profileImage.url
    else:
        student_response['profileImage'] = None

    if student_object.parentTransferCertificate:
        student_response['parentTransferCertificate'] = student_object.parentTransferCertificate.id
    else:
        student_response['parentTransferCertificate'] = None

    student_response['className'] = student_section_object.parentClass.name
    student_response['classDbId'] = student_section_object.parentClass.id
    student_response['sectionName'] = student_section_object.parentDivision.name
    student_response['sectionDbId'] = student_section_object.parentDivision.id
    student_response['studentSectionDbId'] = student_section_object.id

    student_response['rollNumber'] = student_section_object.rollNumber

    return student_response


def get_student_mini_profile_by_school_and_session_id(data):

    student_list = []

    for student_section_object in \
        StudentSection.objects.filter(parentStudent__parentSchool_id=data['schoolDbId'],
                                      parentSession_id=data['sessionDbId']) \
        .order_by('parentClass__orderNumber', 'parentDivision__orderNumber', 'parentStudent__name') \
        .select_related('parentStudent', 'parentClass', 'parentDivision'):

        student_list.append(get_student_mini_profile(student_section_object))

    return student_list
