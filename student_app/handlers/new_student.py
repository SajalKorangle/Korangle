
from student_app.models import Student

from student_app.handlers.common import populate_student_field

from student_app.models import StudentSection

def create_new_student(data, user):

    student_object = Student()

    for key in data:
        if key != 'sectionDbId':
            populate_student_field(student_object, key, data[key])

    student_object.parentUser = user

    student_object.save()

    # student_object.friendSection.add(Section.objects.get(id=data['sectionDbId']))
    student_section_object = StudentSection(parentSection_id=data['sectionDbId'],parentStudent=student_object)
    if 'rollNumber' in data:
        student_section_object.rollNumber = data['rollNumber']
    student_section_object.save()

    response = {}
    response['message'] = 'Student Profile created successfully'

    return response
