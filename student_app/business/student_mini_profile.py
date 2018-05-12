
# Models
from student_app.models import StudentSection
from school_app.model.models import School


def get_student_mini_profile(student_section_object):

    student_object = student_section_object.parentStudent

    student_response = dict()
    student_response['name'] = student_object.name
    student_response['scholarNumber'] = student_object.scholarNumber
    student_response['fathersName'] = student_object.fathersName
    student_response['dbId'] = student_object.id

    student_response['className'] = student_section_object.parentSection.parentClassSession.parentClass.name
    student_response['sectionName'] = student_section_object.parentSection.name
    student_response['sectionDbId'] = student_section_object.parentSection.id

    return student_response


def get_student_mini_profile_by_school_and_session_id(data):

    # user_object = School.objects.get(id=data['schoolDbId']).user.all()[0]

    student_list = []

    for student_section_object in \
        StudentSection.objects.filter(parentStudent__parentSchool_id=data['schoolDbId'],
                                      parentSection__parentClassSession__parentSession_id=data['sessionDbId']) \
        .order_by('parentSection__parentClassSession__parentClass__orderNumber', 'parentSection__orderNumber', 'parentStudent__name') \
        .select_related('parentStudent', 'parentSection__parentClassSession__parentClass'):

        student_list.append(get_student_mini_profile(student_section_object))

    return student_list