
from parent_test import ParentTestCase

# Factories
from student_app.factories.student import StudentFactory

# Models
from school_app.model.models import Session
from student_app.models import StudentSection

# Business
from student_app.business.student_section import create_student_section_list


class StudentSectionTestCase(ParentTestCase):

    def test_create_student_section_list(self):

        student_object = StudentFactory()

        section_object = Session.objects.get(name='Session 2018-19').classsession_set.all()[0].section_set.all()[0]

        data = {
            'sectionDbId': section_object.id,
            'studentList': [
                {
                    'dbId': student_object.id,
                },
            ],
        }

        create_student_section_list(data)

        StudentSection.objects.get(parentStudent=student_object, parentSection=section_object)
