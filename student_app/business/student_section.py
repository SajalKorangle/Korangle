
from student_app.models import StudentSection

from fee_second_app.business.initialize_student_fees import initialize_student_fees


def create_student_section_list(data):

    for student_data in data['studentList']:

        student_section_object = StudentSection(parentStudent_id=student_data['dbId'],
                                                parentSection_id=data['sectionDbId'])
        student_section_object.save()

        initialize_student_fees(student_section_object.parentStudent,
                                student_section_object.parentSection.parentClassSession.parentSession)
