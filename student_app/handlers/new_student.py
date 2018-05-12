
from student_app.models import Student

from student_app.handlers.common import populate_student_field

from student_app.models import StudentSection

from fee_second_app.business.initialize_student_fees import initialize_student_fees


def create_new_student(data, user):

    student_object = Student()

    for key in data:
        if key != 'sectionDbId':
            populate_student_field(student_object, key, data[key])

    student_object.parentSchool = user.school_set.all()[0]

    student_object.save()

    student_section_object = StudentSection(parentSection_id=data['sectionDbId'],parentStudent=student_object)
    if 'rollNumber' in data:
        student_section_object.rollNumber = data['rollNumber']
    student_section_object.save()

    initialize_student_fees(student_object, student_section_object.parentSection.parentClassSession.parentSession)


    response = {}
    response['message'] = 'Student Profile created successfully'

    return response
