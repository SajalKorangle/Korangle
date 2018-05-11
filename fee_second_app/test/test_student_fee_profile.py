
from parent_test import ParentTestCase

# Factories
from student_app.factories.student import StudentFactory

# Models
from school_app.model.models import School, Session, BusStop
from student_app.models import StudentSection

# Business
from fee_second_app.business.student_fee_profile import get_student_fee_profile_by_student_section_object, \
    get_student_fee_profile_list_by_school_and_session_id


class StudentFeeProfileTestCase(ParentTestCase):

    def test_student_fee_profile_list(self):

        school_object = School.objects.get(name='BRIGHT STAR')
        user_object = school_object.user.all()[0]

        data = {
            'schoolDbId': school_object.id,
            'sessionDbId': Session.objects.get(name='Session 2018-19').id,
        }

        response = get_student_fee_profile_list_by_school_and_session_id(data)

        student_section_queryset = \
            StudentSection.objects.filter(parentStudent__parentUser=user_object,
                                          parentSection__parentClassSession__parentSession_id=data['sessionDbId']) \
            .order_by('parentStudent__name')

        self.assertEqual(len(response), student_section_queryset.count())

        index = 0
        for student_section_object in student_section_queryset:
            self.assertEqual(response[index]['dbId'], student_section_object.parentStudent.id)
            index += 1

    def test_get_student_fee_profile(self):

        school_object = School.objects.get(name='BRIGHT STAR')
        user_object = school_object.user.all()[0]
        busStop_object = BusStop.objects.filter(parentSchool=school_object)[0]
        student_object = StudentFactory(currentBusStop=busStop_object, parentUser=user_object)

        student_section_object = \
            StudentSection.objects.get(parentStudent=student_object,
                                       parentSection__parentClassSession__parentSession__name='Session 2017-18')

        response = get_student_fee_profile_by_student_section_object(student_section_object)

        self.assertEqual(len(response), 11)

        self.assertEqual(student_object.name, response['name'])
        self.assertEqual(student_object.id, response['dbId'])
        self.assertEqual(student_object.fathersName, response['fathersName'])
        self.assertEqual(student_object.scholarNumber, response['scholarNumber'])
        self.assertEqual(student_object.mobileNumber, response['mobileNumber'])
        self.assertEqual(student_object.currentBusStop.stopName, response['stopName'])
        self.assertEqual(student_object.rte, response['rte'])
        self.assertEqual(student_section_object.parentSection.id, response['sectionDbId'])
        self.assertEqual(student_section_object.parentSection.name, response['sectionName'])
        self.assertEqual(student_section_object.parentSection.parentClassSession.parentClass.name, response['className'])
        self.assertEqual('sessionFeeStatusList' in response, True)
