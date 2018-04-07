from parent_test import ParentTestCase

from django.contrib.auth.models import User

from student_app.handlers.update_profile import get_class_section_student_list, get_student_profile, update_student, delete_student

from school_app.model.models import Session

from student_app.models import Student, StudentSection

from class_app.models import Section

class UpdateProfileTestCase(ParentTestCase):

    def test_get_class_section_student_list(self):

        for session_object in Session.objects.all():

            user_object = User.objects.get(username='demo')

            data = {}
            data['sessionDbId'] = session_object.id

            response = get_class_section_student_list(data, user_object)

            class_list = ['Class - 12', 'Class - 11', 'Class - 10', 'Class - 9', 'Class - 8', 'Class - 7', 'Class - 6', 'Class - 5', 'Class - 4', 'Class - 3', 'Class - 2', 'Class - 1', 'U.K.G.', 'L.K.G.', 'Nursery', 'Play Group']

            section_list = ['Section - A', 'Section - B', 'Section - C', 'Section - D', 'Section - E', 'Section - F', 'Section - G', 'Section - H', 'Section - I', 'Section - J']

            student_count = 0

            for tempClass in response:

                self.assertEqual(tempClass['name'] in class_list, True)
                self.assertGreaterEqual(len(tempClass['sectionList']), 1)

                for tempSection in tempClass['sectionList']:

                    self.assertEqual(tempSection['name'] in section_list, True)
                    self.assertGreaterEqual(len(tempSection['studentList']), 1)

                    for student_data in tempSection['studentList']:

                        student_object = Student.objects.get(id=student_data['dbId'])
                        self.assertEqual(student_data['name'],student_object.name)

                        student_count += 1

            self.assertEqual(student_count, StudentSection.objects.filter(parentStudent__parentUser=user_object,
                                                                          parentSection__parentClassSession__parentSession=session_object).count())


    def test_get_student_profile(self):

        data = {}
        student_section_object = StudentSection.objects.all()[0]
        data['studentDbId'] = student_section_object.parentStudent.id
        data['sectionDbId'] = student_section_object.parentSection.id

        student_profile_data = get_student_profile(data)

        student_object = Student.objects.get(id=data['studentDbId'])
        section_object = Section.objects.get(id=data['sectionDbId'])

        self.assertEqual(student_object.name,student_profile_data['name'])
        self.assertEqual(student_object.fathersName,student_profile_data['fathersName'])
        self.assertEqual(student_object.mobileNumber,student_profile_data['mobileNumber'])
        self.assertEqual(student_object.dateOfBirth.__str__(),student_profile_data['dateOfBirth'].__str__())
        self.assertEqual(student_object.totalFees,student_profile_data['totalFees'])
        self.assertEqual(student_object.remark,student_profile_data['remark'])
        self.assertEqual(student_object.scholarNumber,student_profile_data['scholarNumber'])
        self.assertEqual(student_object.get_rollNumber(section_object.parentClassSession.parentSession), student_profile_data['rollNumber'])
        self.assertEqual(student_object.motherName,student_profile_data['motherName'])
        self.assertEqual(student_object.gender,student_profile_data['gender'])
        self.assertEqual(student_object.caste,student_profile_data['caste'])
        self.assertEqual(student_object.newCategoryField,student_profile_data['category'])
        self.assertEqual(student_object.newReligionField,student_profile_data['religion'])
        self.assertEqual(student_object.fatherOccupation,student_profile_data['fatherOccupation'])
        self.assertEqual(student_object.address,student_profile_data['address'])
        self.assertEqual(student_object.familySSMID,student_profile_data['familySSMID'])
        self.assertEqual(student_object.childSSMID,student_profile_data['childSSMID'])
        self.assertEqual(student_object.bankName,student_profile_data['bankName'])
        self.assertEqual(student_object.bankAccountNum,student_profile_data['bankAccountNum'])
        self.assertEqual(student_object.aadharNum,student_profile_data['aadharNum'])
        self.assertEqual(student_object.bloodGroup,student_profile_data['bloodGroup'])
        self.assertEqual(student_object.fatherAnnualIncome,student_profile_data['fatherAnnualIncome'])

        if student_profile_data['busStopDbId'] is not None:
            self.assertEqual(student_object.currentBusStop.id, student_profile_data['busStopDbId'])
        else:
            self.assertEqual(None, student_profile_data['busStopDbId'])

    def test_update_student(self):

        student_section_object = StudentSection.objects.all()[0]

        student_object = student_section_object.parentStudent
        section_object = student_section_object.parentSection

        data = {}
        data['dbId'] = student_object.id
        data['name'] = 'Demo Student'
        data['fathersName'] = 'Father Name'
        data['mobileNumber'] = 9898955441
        data['dateOfBirth'] = '2007-04-01'
        data['totalFees'] = 1000
        data['remark'] = 'okay nice'
        data['scholarNumber'] = 'A234'
        data['rollNumber'] = '123'
        data['sectionDbId'] = section_object.id
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
        data['busStopDbId'] = None

        update_student(data)

        student_object = Student.objects.get(id=data['dbId'])

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
        self.assertEqual(student_object.currentBusStop, None)

    def test_delete_student(self):

        student_object = Student.objects.all()[0]

        data = {}
        data['studentDbId'] = student_object.id

        delete_student(data)

        self.assertEqual(Student.objects.filter(id=data['studentDbId']).count(),0)