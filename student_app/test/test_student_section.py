
from parent_test import ParentTestCase

# Factories
from student_app.factories.student import StudentFactory, StudentSectionFactory
from school_app.factory.school import SchoolFactory

# Models
from school_app.model.models import Session
from student_app.models import StudentSection, Student
from class_app.models import Division, Class

# Business
from student_app.business.student_section import create_student_section_list, \
    update_student_section, create_student_section


class StudentSectionTestCase(ParentTestCase):

    def test_update_student_section(self):

        student_section_object = StudentSectionFactory()

        data = {
            'id': student_section_object.id,
            'parentStudent': student_section_object.parentStudent.id,
            'parentDivision': Division.objects.all()[0].id,
            'parentClass': Class.objects.all()[0].id,
            'parentSession': Session.objects.all()[0].id,
        }

        update_student_section(data)

        StudentSection.objects.get(id=data['id'],
                                   parentDivision_id=data['parentDivision'],
                                   parentClass_id=data['parentClass'],
                                   parentSession_id=data['parentSession'])

    def test_create_student_section_list(self):

        # student_object = StudentFactory()

        school_object = SchoolFactory()

        student_object = Student(name='okay', fathersName='okay', parentSchool=school_object)
        student_object.save()

        division_object = Division.objects.all()[0]
        class_object = Class.objects.all()[0]
        session_object = Session.objects.all()[0]

        data = {
            'sectionDbId': division_object.id,
            'classDbId': class_object.id,
            'parentSession': session_object.id,
            'studentList': [
                {
                    'dbId': student_object.id,
                },
            ],
        }

        create_student_section_list(data)

        StudentSection.objects.get(parentStudent=student_object,
                                   parentDivision=division_object,
                                   parentClass=class_object,
                                   parentSession=session_object)

    def test_create_student_section(self):

        # student_object = StudentFactory()

        school_object = SchoolFactory()

        student_object = Student(name='okay', fathersName='okay', parentSchool=school_object)
        student_object.save()

        division_object = Division.objects.all()[0]
        class_object = Class.objects.all()[0]
        session_object = Session.objects.all()[0]

        data = {
            'parentStudent': student_object.id,
            'parentDivision': division_object.id,
            'parentClass': class_object.id,
            'parentSession': session_object.id,
            'rollNumber': None,
        }

        create_student_section(data)

        StudentSection.objects.get(parentStudent=student_object,
                                   parentDivision=division_object,
                                   parentClass=class_object,
                                   parentSession=session_object)
