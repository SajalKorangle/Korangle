from parent_test import ParentTestCase

from examination_app.handlers.marksheet import get_marksheet

from examination_app.handlers.result import create_student_result

from examination_app.test.common import preparingStudentTestResult, deletingStudentResult

from school_app.model.models import Student, SchoolSession
from examination_app.models import StudentTestResult, Grade, MaximumMarksAllowed
from class_app.models import Section
from student_app.models import StudentSection

from django.db.models import Sum

class MarksheetTestCase(ParentTestCase):

    def test_get_marksheet_when_populated(self):

        dataone = preparingStudentTestResult(12)

        create_student_result(dataone)

        data = {}
        data['sectionDbId'] = dataone['sectionDbId']
        data['studentDbId'] = dataone['studentDbId']

        response = get_marksheet(data)

        student_object = Student.objects.get(id=data['studentDbId'])

        self.assertEqual(response['sectionDbId'], data['sectionDbId'])
        self.assertEqual(response['studentDbId'], data['studentDbId'])
        self.assertEqual(response['className'], student_object.get_class_name(Section.objects.get(id=data['sectionDbId']).parentClassSession.parentSession))
        self.assertEqual(response['sectionName'], Section.objects.get(id=data['sectionDbId']).name)
        self.assertEqual(response['sessionName'], Section.objects.get(id=data['sectionDbId']).parentClassSession.parentSession.name)

        '''self.assertEqual(response['studentProfile']['rollNumber'], student_object.currentRollNumber)'''
        self.assertEqual(response['studentProfile']['rollNumber'], student_object.get_rollNumber(Section.objects.get(id=data['sectionDbId']).parentClassSession.parentSession))
        self.assertEqual(response['studentProfile']['name'], student_object.name)
        self.assertEqual(response['studentProfile']['fathersName'], student_object.fathersName)
        self.assertEqual(response['studentProfile']['motherName'], student_object.motherName)
        self.assertEqual(response['studentProfile']['dateOfBirth'], student_object.dateOfBirth)
        self.assertEqual(response['studentProfile']['address'], student_object.address)
        self.assertEqual(response['studentProfile']['scholarNumber'], student_object.scholarNumber)
        self.assertEqual(response['studentProfile']['mobileNumber'], student_object.mobileNumber)
        self.assertEqual(response['studentProfile']['category'], student_object.newCategoryField)
        self.assertEqual(response['studentProfile']['childSSMID'], student_object.childSSMID)

        index = 0
        for student_test_result_object in StudentTestResult.objects.filter(parentStudent_id=data['studentDbId'],
                                                                           parentTest__parentSection_id=data['sectionDbId'])\
            .order_by('parentTest__parentSubject__orderNumber'):

            self.assertEqual(response['result'][index]['subjectName'], student_test_result_object.parentTest.parentSubject.name)
            self.assertEqual(response['result'][index]['governmentSubject'], student_test_result_object.parentTest.parentSubject.governmentSubject)
            self.assertEqual(response['result'][index]['maximumMarks'], student_test_result_object.parentTest.parentMaximumMarks.marks)
            self.assertEqual(response['result'][index]['marksObtained'], student_test_result_object.marksObtained)
            self.assertEqual(response['result'][index]['grade'],student_test_result_object.grade)

            index += 1

        school_session_object = SchoolSession.objects.get(parentSchool=student_object.school,
                                                          parentSession=Section.objects.get(id=data['sectionDbId'])
                                                          .parentClassSession.parentSession)

        self.assertEqual(response['workingDays'], school_session_object.workingDays)
        self.assertEqual(response['attendance'],
                         StudentSection.objects.get(parentStudent=student_object,
                                                    parentSection_id=data['sectionDbId']).attendance)

        totalMaximumMarks = StudentTestResult.objects.filter(parentStudent_id=data['studentDbId'],
                                                             parentTest__parentSection_id=data['sectionDbId'],
                                                             parentTest__parentSubject__governmentSubject=True)\
            .aggregate(Sum('parentTest__parentMaximumMarks__marks'))['parentTest__parentMaximumMarks__marks__sum']

        totalMarksObtained = StudentTestResult.objects.filter(parentStudent_id=data['studentDbId'],
                                                              parentTest__parentSection_id=data['sectionDbId'],
                                                              parentTest__parentSubject__governmentSubject=True) \
            .aggregate(Sum('marksObtained'))['marksObtained__sum']

        overAllGradeValue = Grade.objects.get(parentMaximumMarksAllowed__marks=totalMaximumMarks,
                                              maximumMarks__gte=totalMarksObtained,
                                              minimumMarks__lte=totalMarksObtained).value


        self.assertEqual(response['overAllGrade'], overAllGradeValue)

    def test_get_marksheet_when_null(self):

        # dataone = preparingStudentTestResult(12)

        data = deletingStudentResult()

        response = get_marksheet(data)

        student_object = Student.objects.get(id=data['studentDbId'])

        self.assertEqual(response['sectionDbId'], data['sectionDbId'])
        self.assertEqual(response['studentDbId'], data['studentDbId'])
        self.assertEqual(response['className'], student_object.get_class_name(Section.objects.get(id=data['sectionDbId']).parentClassSession.parentSession))
        self.assertEqual(response['sectionName'], Section.objects.get(id=data['sectionDbId']).name)
        self.assertEqual(response['sessionName'], Section.objects.get(id=data['sectionDbId']).parentClassSession.parentSession.name)

        '''self.assertEqual(response['studentProfile']['rollNumber'], student_object.currentRollNumber)'''
        self.assertEqual(response['studentProfile']['rollNumber'], student_object.get_rollNumber(Section.objects.get(id=data['sectionDbId']).parentClassSession.parentSession))
        self.assertEqual(response['studentProfile']['name'], student_object.name)
        self.assertEqual(response['studentProfile']['fathersName'], student_object.fathersName)
        self.assertEqual(response['studentProfile']['motherName'], student_object.motherName)
        self.assertEqual(response['studentProfile']['dateOfBirth'], student_object.dateOfBirth)
        self.assertEqual(response['studentProfile']['address'], student_object.address)
        self.assertEqual(response['studentProfile']['scholarNumber'], student_object.scholarNumber)
        self.assertEqual(response['studentProfile']['mobileNumber'], student_object.mobileNumber)
        self.assertEqual(response['studentProfile']['category'], student_object.newCategoryField)
        self.assertEqual(response['studentProfile']['childSSMID'], student_object.childSSMID)

        self.assertEqual(len(response['result']), 0)

