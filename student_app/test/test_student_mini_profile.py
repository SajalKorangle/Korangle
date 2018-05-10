
from parent_test import ParentTestCase

# Business
from student_app.business.student_mini_profile import get_student_mini_profile, \
    get_student_mini_profile_by_school_and_session_id

# Factories
from student_app.factories.student import StudentFactory

# Models
from student_app.models import StudentSection
from school_app.model.models import School, Session


class StudentMiniProfileTestCase(ParentTestCase):

    def test_get_student_mini_profile(self):

        student_object = StudentFactory(scholarNumber='1234')

        student_section_object = StudentSection.objects.get(parentStudent=student_object)

        response = get_student_mini_profile(student_section_object)

        self.assertEqual(response['name'], student_object.name)
        self.assertEqual(response['dbId'], student_object.id)
        self.assertEqual(response['fathersName'], student_object.fathersName)
        self.assertEqual(response['scholarNumber'], student_object.scholarNumber)
        self.assertEqual(response['className'], student_section_object.parentSection.parentClassSession.parentClass.name)
        self.assertEqual(response['sectionName'], student_section_object.parentSection.name)
        self.assertEqual(response['sectionDbId'], student_section_object.parentSection.id)

    def test_get_student_mini_profile_by_school_and_session_id(self):

        school_object = School.objects.get(name='BRIGHT STAR')
        session_object = Session.objects.get(name='Session 2017-18')

        data = {
            'schoolDbId': school_object.id,
            'sessionDbId': session_object.id,
        }

        response = get_student_mini_profile_by_school_and_session_id(data)

        user_object = school_object.user.all()[0]

        student_section_queryset = \
            StudentSection.objects.filter(parentStudent__parentUser=user_object,
                                          parentSection__parentClassSession__parentSession=session_object) \
            .order_by('parentSection__parentClassSession__parentClass__orderNumber', 'parentSection__orderNumber', 'parentStudent__name')

        self.assertEqual(len(response), student_section_queryset.count())

        index = 0
        for student_section_object in student_section_queryset:

            self.assertEqual(response[index]['dbId'], student_section_object.parentStudent.id)
            index += 1
