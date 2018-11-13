
from student_app.models import Student

from student_app.handlers.common import populate_student_field

from student_app.models import StudentSection

from school_app.model.models import School

from fee_second_app.business.initialize_student_fees import initialize_student_fees


def create_new_student(data):

    student_object = Student()

    for key in data:
        if key != 'sectionDbId' and key != 'classDbId' and key != 'sessionDbId':
            populate_student_field(student_object, key, data[key])

    student_object.parentSchool = School.objects.get(id=data['schoolDbId'])

    student_object.save()

    student_section_object = StudentSection(parentClass_id=data['classDbId'],
                                            parentDivision_id=data['sectionDbId'],
                                            parentStudent=student_object,
                                            parentSession_id=data['sessionDbId'])
    if 'rollNumber' in data:
        student_section_object.rollNumber = data['rollNumber']
    student_section_object.save()

    initialize_student_fees(student_object, student_section_object.parentSession)


    response = {}
    response['message'] = 'Student Profile created successfully'

    return response
