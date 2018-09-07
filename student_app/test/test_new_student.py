from parent_test import ParentTestCase

from django.contrib.auth.models import User

from student_app.handlers.new_student import create_new_student

from school_app.model.models import Session, School

from student_app.models import Student

from class_app.models import Section

class NewStudentTestCase(ParentTestCase):

    def test_new_student(self):

        school_object = School.objects.get(name='BRIGHT STAR')

        data = {}
        data['name'] = 'Demo Student'
        data['fathersName'] = 'Father Name'
        data['mobileNumber'] = 9898955441
        data['dateOfBirth'] = '2007-04-01'
        data['totalFees'] = 1000
        data['remark'] = 'okay nice'
        data['scholarNumber'] = 'A234'
        data['rollNumber'] = '123'
        data['motherName'] = 'Mother Name'
        data['gender'] = 'Male'
        data['caste'] = 'Goyal'
        data['category'] = 'SC'
        data['religion'] = 'Jainism'
        data['fatherOccupation'] = 'Farmer'
        data['address'] = 'Hadlay, Akodiya'
        data['familySSMID'] = 12345678
        data['childSSMID'] = 1234556789
        data['bankName'] = 'State Bank Of India'
        data['bankAccountNum'] = 'SBI0000342342'
        data['aadharNum'] = 123456789012
        data['bloodGroup'] = 'O +'
        data['fatherAnnualIncome'] = '15,000'
        data['busStopDbId'] = school_object.busstop_set.all()[0].id

        session_object = Session.objects.all()[0]

        data['admissionSessionDbId'] = session_object.id

        data['dateOfAdmission'] = '2011-04-15'

        section_object = Section.objects.get(parentClassSession__parentSession=session_object,
                                                parentClassSession__parentClass__name='Class - 12',
                                                name='Section - A')

        data['sectionDbId'] = section_object.id

        data['schoolDbId'] = school_object.id

        response = create_new_student(data)

        self.assertEqual(response['message'], 'Student Profile created successfully')

        student_queryset = Student.objects.filter(name=data['name'], fathersName=data['fathersName'],
                                                  mobileNumber=data['mobileNumber'])

        self.assertGreaterEqual(student_queryset.count(), 1)

        for student_object in student_queryset:

            self.assertEqual(student_object.mobileNumber,data['mobileNumber'])
            self.assertEqual(student_object.dateOfBirth.__str__(),data['dateOfBirth'])
            self.assertEqual(student_object.totalFees,data['totalFees'])
            self.assertEqual(student_object.remark,data['remark'])
            self.assertEqual(student_object.scholarNumber,data['scholarNumber'])
            self.assertEqual(student_object.get_rollNumber(section_object.parentClassSession.parentSession), data['rollNumber'])
            self.assertEqual(student_object.motherName,data['motherName'])
            self.assertEqual(student_object.gender,data['gender'])
            self.assertEqual(student_object.caste,data['caste'])
            self.assertEqual(student_object.newCategoryField,data['category'])
            self.assertEqual(student_object.newReligionField,data['religion'])
            self.assertEqual(student_object.fatherOccupation,data['fatherOccupation'])
            self.assertEqual(student_object.address,data['address'])
            self.assertEqual(student_object.familySSMID,data['familySSMID'])
            self.assertEqual(student_object.childSSMID,data['childSSMID'])
            self.assertEqual(student_object.bankName,data['bankName'])
            self.assertEqual(student_object.bankAccountNum,data['bankAccountNum'])
            self.assertEqual(student_object.aadharNum,data['aadharNum'])
            self.assertEqual(student_object.bloodGroup,data['bloodGroup'])
            self.assertEqual(student_object.fatherAnnualIncome,data['fatherAnnualIncome'])
            self.assertEqual(student_object.currentBusStop.id, data['busStopDbId'])
            self.assertEqual(student_object.admissionSession.id, data['admissionSessionDbId'])
            self.assertEqual(student_object.dateOfAdmission.__str__(),data['dateOfAdmission'])

            self.assertEqual(student_object.get_section_id(session_object),data['sectionDbId'])

