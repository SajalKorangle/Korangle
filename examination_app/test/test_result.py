from parent_test import ParentTestCase

from student_app.models import StudentSection

from class_app.models import Section

from examination_app.models import StudentTestResult
from school_app.model.models import SchoolSession

from examination_app.handlers.result import get_section_student_result, create_student_result

from examination_app.test.common import deletingStudentResult, deletingAndPreparingStudentResult, preparingStudentTestResult

class ResultTestCase(ParentTestCase):

    def test_get_section_student_test_result_when_null(self):

        data = deletingStudentResult()

        response = get_section_student_result(data)

        self.assertEqual(response['sectionDbId'], data['sectionDbId'])
        self.assertEqual(response['studentDbId'], data['studentDbId'])
        self.assertEqual(response['attendance'], StudentSection.objects.get(parentStudent_id=data['studentDbId'],
                                                                            parentSection_id=data['sectionDbId']).attendance)
        self.assertEqual(response['workingDays'],
                         SchoolSession.objects.get(parentSchool__name='EKLAVYA ACADEMY',
                                                   parentSession=Section.objects.get(id=data['sectionDbId'])
                                                   .parentClassSession.parentSession).workingDays)

        for result_object in response['result']:
            self.assertEqual(result_object['marksObtained'], None)



    def test_get_section_student_test_result_when_populated(self):

        data = preparingStudentTestResult(12)

        create_student_result(data)

        response = get_section_student_result(data)

        self.assertEqual(response['sectionDbId'], data['sectionDbId'])
        self.assertEqual(response['studentDbId'], data['studentDbId'])
        self.assertEqual(response['attendance'], data['attendance'])
        self.assertEqual(response['workingDays'],
                         SchoolSession.objects.get(parentSchool__name='EKLAVYA ACADEMY',
                                                   parentSession=Section.objects.get(id=data['sectionDbId'])
                                                   .parentClassSession.parentSession).workingDays)
        self.assertEqual(len(response['result']),
                         StudentTestResult.objects.filter(parentTest__parentSection_id=data['sectionDbId'],
                                                          parentStudent_id=data['studentDbId']).count())

        for result_object in response['result']:
            self.assertEqual(result_object['marksObtained'],
                             StudentTestResult.objects.get(parentTest_id=result_object['testDbId'],
                                                           parentStudent_id=response['studentDbId']).marksObtained)

    def test_create_student_test_result_when_null(self):

        data = deletingAndPreparingStudentResult()

        response = create_student_result(data)

        self.assertRegex(response, 'success')

        response = get_section_student_result(data)

        self.assertEqual(response['sectionDbId'], data['sectionDbId'])
        self.assertEqual(response['studentDbId'], data['studentDbId'])
        self.assertEqual(response['attendance'], data['attendance'])
        self.assertEqual(response['workingDays'],
                         SchoolSession.objects.get(parentSchool__name='EKLAVYA ACADEMY',
                                                   parentSession=Section.objects.get(id=data['sectionDbId'])
                                                   .parentClassSession.parentSession).workingDays)
        self.assertEqual(len(data['result']),
                         StudentTestResult.objects.filter(parentTest__parentSection_id=data['sectionDbId'],
                                                          parentStudent_id=data['studentDbId']).count())

        for result_object in data['result']:
            self.assertEqual(round(float(result_object['marksObtained']) * 10),
                             StudentTestResult.objects.get(parentTest_id=result_object['testDbId'],
                                                           parentStudent_id=data['studentDbId']).marksObtained * 10)

    def test_create_student_test_result_when_populated(self):

        dataone = preparingStudentTestResult(12)

        create_student_result(dataone)

        data = preparingStudentTestResult(27)

        response = create_student_result(data)

        self.assertRegex(response, 'success')

        response = get_section_student_result(data)

        self.assertEqual(response['sectionDbId'], data['sectionDbId'])
        self.assertEqual(response['studentDbId'], data['studentDbId'])
        self.assertEqual(response['attendance'], data['attendance'])
        self.assertEqual(response['workingDays'],
                         SchoolSession.objects.get(parentSchool__name='EKLAVYA ACADEMY',
                                                   parentSession=Section.objects.get(id=data['sectionDbId'])
                                                   .parentClassSession.parentSession).workingDays)
        self.assertEqual(len(data['result']),
                         StudentTestResult.objects.filter(parentTest__parentSection_id=data['sectionDbId'],
                                                          parentStudent_id=data['studentDbId']).count())

        for result_object in data['result']:
            self.assertEqual(round(float(result_object['marksObtained'])*10),
                             StudentTestResult.objects.get(parentTest_id=result_object['testDbId'],
                                                           parentStudent_id=data['studentDbId']).marksObtained*10)

