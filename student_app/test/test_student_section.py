
from parent_test import ParentTestCase

# Factories
from student_app.factories.student import StudentFactory, StudentSectionFactory

# Models
from school_app.model.models import Session
from student_app.models import StudentSection
from class_app.models import Section

# Business
from student_app.business.student_section import create_student_section_list, update_student_section


class StudentSectionTestCase(ParentTestCase):

    def test_update_student_section(self):

        student_section_object = StudentSectionFactory()

        data = {
            'id': student_section_object.id,
            'parentStudent': student_section_object.parentStudent.id,
            'parentSection': Section.objects.all()[0].id,
        }

        update_student_section(data)

        StudentSection.objects.get(id=data['id'], parentSection_id=data['parentSection'])

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
