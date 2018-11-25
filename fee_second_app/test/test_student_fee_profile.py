
from parent_test import ParentTestCase

# Factories
from student_app.factories.student import StudentFactory

# Models
from school_app.model.models import School, Session, BusStop
from student_app.models import StudentSection

# Business
from fee_second_app.business.student_fee_profile import get_student_fee_profile_by_student_section_object, \
    get_student_fee_profile_list_by_school_and_session_id, get_student_fee_profile


class StudentFeeProfileTestCase(ParentTestCase):

    def test_get_student_fee_profile(self):

        school_object = School.objects.get(name='BRIGHT STAR')
        busStop_object = BusStop.objects.filter(parentSchool=school_object)[0]
        student_object = StudentFactory(currentBusStop=busStop_object, parentSchool=school_object)

        student_section_object = \
            StudentSection.objects.get(parentStudent=student_object,
                                       parentSession__name='Session 2017-18')

        data = {
            'studentDbId': student_section_object.parentStudent.id,
            'sessionDbId': student_section_object.parentSession.id,
        }

        response = get_student_fee_profile(data)

        self.assertEqual(response['dbId'], student_section_object.parentStudent.id)
        self.assertEqual(response['sectionDbId'], student_section_object.parentDivision.id)

    def test_get_student_fee_profile_by_student_section_object(self):

        school_object = School.objects.get(name='BRIGHT STAR')
        busStop_object = BusStop.objects.filter(parentSchool=school_object)[0]
        student_object = StudentFactory(currentBusStop=busStop_object, parentSchool=school_object)

        student_section_object = \
            StudentSection.objects.get(parentStudent=student_object,
                                       parentSession__name='Session 2017-18')

        response = get_student_fee_profile_by_student_section_object(student_section_object)

        self.assertEqual(len(response), 14)

        self.assertEqual(student_object.name, response['name'])
        self.assertEqual(student_object.id, response['dbId'])
        self.assertEqual(student_object.fathersName, response['fathersName'])
        self.assertEqual(student_object.scholarNumber, response['scholarNumber'])
        self.assertEqual(student_object.mobileNumber, response['mobileNumber'])
        self.assertEqual(student_object.address, response['address'])
        if student_object.profileImage:
            self.assertEqual(student_object.profileImage.url, response['profileImage'])
        else:
            self.assertEqual(None, response['profileImage'])
        self.assertEqual(student_object.currentBusStop.stopName, response['stopName'])
        self.assertEqual(student_object.rte, response['rte'])
        self.assertEqual(student_section_object.parentDivision.id, response['sectionDbId'])
        self.assertEqual(student_section_object.parentDivision.name, response['sectionName'])
        self.assertEqual(student_section_object.parentClass.name, response['className'])
        self.assertEqual('sessionFeeStatusList' in response, True)
