
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
        if student_object.profileImage:
            self.assertEqual(response['profileImage'], student_object.profileImage.url)
        else:
            self.assertEqual(response['profileImage'], None)
        if student_object.parentTransferCertificate:
            self.assertEqual(response['parentTransferCertificate'], student_object.parentTransferCertificate.id)
        else:
            self.assertEqual(response['parentTransferCertificate'], None)
        self.assertEqual(response['className'], student_section_object.parentClass.name)
        self.assertEqual(response['sectionName'], student_section_object.parentDivision.name)
        self.assertEqual(response['sectionDbId'], student_section_object.parentDivision.id)

    def test_get_student_mini_profile_by_school_and_session_id(self):

        school_object = School.objects.get(name='BRIGHT STAR')
        session_object = Session.objects.get(name='Session 2017-18')

        data = {
            'schoolDbId': school_object.id,
            'sessionDbId': session_object.id,
        }

        response = get_student_mini_profile_by_school_and_session_id(data)

        student_section_queryset = \
            StudentSection.objects.filter(parentStudent__parentSchool=school_object,
                                          parentSession=session_object) \
            .order_by('parentClass__orderNumber', 'parentDivision__orderNumber', 'parentStudent__name')

        self.assertEqual(len(response), student_section_queryset.count())

        index = 0
        for student_section_object in student_section_queryset:

            self.assertEqual(response[index]['dbId'], student_section_object.parentStudent.id)
            index += 1
