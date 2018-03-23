
from school_app.model.models import Student, SchoolSession
from examination_app.models import StudentTestResult, Test
from student_app.models import StudentSection
from class_app.models import Section

from django.core.exceptions import ObjectDoesNotExist

def get_section_student_result(data):

    response = {}
    response['sectionDbId'] = data['sectionDbId']
    response['studentDbId'] = data['studentDbId']

    student_object = Student.objects.get(id=data['studentDbId'])

    response['scholarNumber'] = student_object.scholarNumber

    response['result'] = []
    for test_object in Test.objects.filter(parentSection_id=data['sectionDbId'],
                                           parentSchool=student_object.school).order_by('parentSubject__orderNumber'):
        tempResult = {}
        tempResult['testDbId'] = test_object.id
        tempResult['subjectDbId'] = test_object.parentSubject.id
        tempResult['maximumMarksAllowedDbId'] = test_object.parentMaximumMarks.id

        try:
            student_test_result_object = StudentTestResult.objects.get(parentTest=test_object, parentStudent=student_object)
            tempResult['marksObtained'] = student_test_result_object.marksObtained
        except ObjectDoesNotExist:
            tempResult['marksObtained'] = None

        response['result'].append(tempResult)

    response['attendance'] = StudentSection.objects.get(parentStudent=student_object, parentSection_id=data['sectionDbId']).attendance
    response['workingDays'] = SchoolSession.objects.get(parentSchool__name='EKLAVYA',
                                                        parentSession=Section.objects.get(id=data['sectionDbId'])
                                                        .parentClassSession.parentSession).workingDays

    return response

def create_student_result(data):

    student_object = Student.objects.get(id=data['studentDbId'])

    for result in data['result']:

        try:
            student_test_result_object = StudentTestResult.objects.get(parentTest_id=result['testDbId'], parentStudent=student_object)
            student_test_result_object.marksObtained = result['marksObtained']
            student_test_result_object.save()
        except ObjectDoesNotExist:
            student_test_result_object = StudentTestResult(parentTest_id=result['testDbId'],
                                                           parentStudent=student_object,
                                                           marksObtained=result['marksObtained'])
            student_test_result_object.save()


    student_section_object = StudentSection.objects.get(parentStudent=student_object,
                                                        parentSection_id=data['sectionDbId'])
    student_section_object.attendance = data['attendance']
    student_section_object.save()

    return 'Student Result updated successfully'


