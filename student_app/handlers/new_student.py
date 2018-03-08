
from class_app.models import Section

from school_app.models import Student

from student_app.handlers.common import populate_student_field

def create_new_student(data, user):

    student_object = Student()

    for key in data:
        if key != 'sectionDbId':
            populate_student_field(student_object, key, data[key])

    student_object.parentUser = user

    student_object.save()

    student_object.friendSection.add(Section.objects.get(id=data['sectionDbId']))
    student_object.save()

    response = {}
    response['message'] = 'Student Profile created successfully'

    return response
