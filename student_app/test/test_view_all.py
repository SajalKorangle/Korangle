from parent_test import ParentTestCase

from django.contrib.auth.models import User

from student_app.handlers.view_all import get_class_section_student_profile_list

from school_app.model.models import Session

from student_app.models import Student, StudentSection

from fee_app.models import SubFee

class ViewAllTestCase(ParentTestCase):

    def test_get_class_section_student_profile_list(self):

        for session_object in Session.objects.all():

            user_object = User.objects.get(username='demo')

            data = {}
            data['sessionDbId'] = session_object.id

            response = get_class_section_student_profile_list(data, user_object)

            class_section_student_list = response

            class_list = ['Class - 12', 'Class - 11', 'Class - 10', 'Class - 9', 'Class - 8', 'Class - 7', 'Class - 6', 'Class - 5', 'Class - 4', 'Class - 3', 'Class - 2', 'Class - 1', 'U.K.G.', 'L.K.G.', 'Nursery', 'Play Group']

            section_list = ['Section - A', 'Section - B', 'Section - C', 'Section - D', 'Section - E', 'Section - F', 'Section - G', 'Section - H', 'Section - I', 'Section - J']

            student_count = 0

            for tempClass in class_section_student_list:

                self.assertEqual(tempClass['name'] in class_list, True)
                self.assertGreaterEqual(len(tempClass['sectionList']), 1)

                for tempSection in tempClass['sectionList']:

                    self.assertEqual(tempSection['name'] in section_list, True)
                    self.assertGreaterEqual(len(tempSection['studentList']), 1)

                    for student_data in tempSection['studentList']:

                        student_object = Student.objects.get(id=student_data['dbId'])

                        self.assertEqual(student_data['name'],student_object.name)
                        self.assertEqual(student_data['fathersName'],student_object.fathersName)
                        self.assertEqual(student_data['mobileNumber'],student_object.mobileNumber)
                        self.assertEqual(student_data['dateOfBirth'],student_object.dateOfBirth)
                        self.assertEqual(student_data['totalFees'],student_object.totalFees)
                        self.assertEqual(student_data['remark'],student_object.remark)
                        self.assertEqual(student_data['rollNumber'], student_object.get_rollNumber(session_object))
                        self.assertEqual(student_data['scholarNumber'],student_object.scholarNumber)
                        self.assertEqual(student_data['motherName'],student_object.motherName)
                        self.assertEqual(student_data['gender'],student_object.gender)
                        self.assertEqual(student_data['caste'],student_object.caste)
                        self.assertEqual(student_data['category'],student_object.newCategoryField)
                        self.assertEqual(student_data['religion'],student_object.newReligionField)
                        self.assertEqual(student_data['fatherOccupation'],student_object.fatherOccupation)
                        self.assertEqual(student_data['address'],student_object.address)
                        self.assertEqual(student_data['familySSMID'],student_object.familySSMID)
                        self.assertEqual(student_data['childSSMID'],student_object.childSSMID)
                        self.assertEqual(student_data['bankName'],student_object.bankName)
                        self.assertEqual(student_data['bankAccountNum'],student_object.bankAccountNum)
                        self.assertEqual(student_data['aadharNum'],student_object.aadharNum)
                        self.assertEqual(student_data['bloodGroup'],student_object.bloodGroup)
                        self.assertEqual(student_data['fatherAnnualIncome'],student_object.fatherAnnualIncome)
                        if student_object.currentBusStop is not None:
                            self.assertEqual(student_data['busStopDbId'],student_object.busStopId)
                        else:
                            self.assertEqual(student_data['busStopDbId'],None)

                        self.assertEqual(student_data['sectionDbId'],student_object.get_section_id(session_object))
                        self.assertEqual(student_data['sectionName'],student_object.get_section_name(session_object))
                        self.assertEqual(student_data['className'],student_object.get_class_id(session_object))
                        self.assertEqual(student_data['classDbId'],student_object.get_class_name(session_object))

                        feesDue = student_object.totalFees
                        for studentFeeEntry in student_object.fee_set.all().order_by('-generationDateTime'):
                            lateFeeAmount = 0
                            lateFee = SubFee.objects.filter(parentFee=studentFeeEntry, particular='LateFee')
                            if lateFee:
                                lateFeeAmount = lateFee[0].amount

                            feesDue -= studentFeeEntry.amount
                            feesDue += lateFeeAmount
                        for studentConcessionEntry in student_object.concession_set.all():
                            feesDue -= studentConcessionEntry.amount

                        self.assertEqual(student_data['feesDue'], feesDue)

                        student_count += 1

            self.assertEqual(student_count, StudentSection.objects.filter(parentStudent__parentUser=user_object,
                                                                          parentSection__parentClassSession__parentSession=session_object).count())

