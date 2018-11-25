
from parent_test import ParentTestCase

# Factories
from student_app.factories.student import StudentFactory

# Models
from school_app.model.models import School, Session, BusStop
from student_app.models import StudentSection
from fee_second_app.models import StudentFeeDues

# Business
from fee_second_app.business.student_fee_dues import get_student_fee_dues, get_student_fee_dues_list_by_school_and_session_id


class StudentFeeDuesTestCase(ParentTestCase):

    def test_student_fee_dues_list_by_school_and_session_id(self):

        data = {
            'schoolDbId': School.objects.get(name='BRIGHT STAR').id,
            'sessionDbId': Session.objects.get(name='Session 2018-19').id,
        }

        response = get_student_fee_dues_list_by_school_and_session_id(data)

        student_section_queryset = \
            StudentSection.objects.filter(parentStudent__parentSchool=data['schoolDbId'],
                                          parentSession_id=data['sessionDbId']) \
            .order_by('parentStudent__name')

        self.assertEqual(len(response), student_section_queryset.count())

        index = 0
        for student_section_object in student_section_queryset:
            self.assertEqual(response[index]['dbId'], student_section_object.parentStudent.id)
            index += 1

    def test_get_student_fee_dues(self):

        school_object = School.objects.get(name='BRIGHT STAR')
        busStop_object = BusStop.objects.filter(parentSchool=school_object)[0]

        student_section_object = \
            StudentSection.objects.filter(parentStudent__parentSchool=school_object,
                                       parentSession__name='Session 2017-18')[0]

        student_object = student_section_object.parentStudent

        response = get_student_fee_dues(student_section_object)

        self.assertEqual(len(response), 13)

        self.assertEqual(student_object.name, response['name'])
        self.assertEqual(student_object.id, response['dbId'])
        self.assertEqual(student_object.fathersName, response['fathersName'])
        self.assertEqual(student_object.scholarNumber, response['scholarNumber'])
        self.assertEqual(student_object.mobileNumber, response['mobileNumber'])
        if student_section_object.parentStudent.currentBusStop is None:
            self.assertEqual(None, response['stopName'])
        else:
            self.assertEqual(student_section_object.parentStudent.currentBusStop.stopName,
                             response['stopName'])
        self.assertEqual(student_object.rte, response['rte'])
        self.assertEqual(student_section_object.parentDivision.id, response['sectionDbId'])
        self.assertEqual(student_section_object.parentDivision.name, response['sectionName'])
        self.assertEqual(student_section_object.parentClass.name, response['className'])
        if student_section_object.parentStudent.parentTransferCertificate is None:
            self.assertEqual(None, response['parentTransferCertificate'])
        else:
            self.assertEqual(student_section_object.parentStudent.parentTransferCertificate_id,
                             response['parentTransferCertificate'])
        self.assertEqual(StudentFeeDues.objects.get(parentStudent=student_section_object.parentStudent).amount, response['feesDue'])
