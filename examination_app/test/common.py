
from student_app.models import StudentSection
from examination_app.models import Test, StudentTestResult

def preparingStudentTestResult(number):

    student_section_object = StudentSection.objects.filter(parentStudent__parentUser__username='eklavya')[0]

    school_object = student_section_object.parentStudent.parentUser.school_set.all()[0]

    data = {}
    data['studentDbId'] = student_section_object.parentStudent.id
    data['sectionDbId'] = student_section_object.parentSection.id

    data['result'] = []
    for test_object in Test.objects.filter(parentSection_id=data['sectionDbId'],
                                           parentSchool=school_object).order_by('parentSubject__orderNumber'):
        tempResult = {}
        tempResult['testDbId'] = test_object.id
        tempResult['marksObtained'] = str(test_object.id-50) + '.' + str(number)
        data['result'].append(tempResult)

    data['attendance'] = number

    return data

def deletingStudentResult():

    student_section_object = StudentSection.objects.filter(parentStudent__parentUser__username='eklavya')[0]

    data = {}
    data['sectionDbId'] = student_section_object.parentSection.id
    data['studentDbId'] = student_section_object.parentStudent.id

    StudentTestResult.objects.filter(parentTest__parentSection_id=data['sectionDbId'],
                                     parentStudent_id=data['studentDbId']).delete()

    return data

def deletingAndPreparingStudentResult():

    student_section_object = StudentSection.objects.filter(parentStudent__parentUser__username='eklavya')[0]

    school_object = student_section_object.parentStudent.parentUser.school_set.all()[0]

    data = {}
    data['sectionDbId'] = student_section_object.parentSection.id
    data['studentDbId'] = student_section_object.parentStudent.id

    StudentTestResult.objects.filter(parentTest__parentSection_id=data['sectionDbId'],
                                     parentStudent_id=data['studentDbId']).delete()

    data['result'] = []
    for test_object in Test.objects.filter(parentSection_id=data['sectionDbId'],
                                           parentSchool=school_object):
        tempResult = {}
        tempResult['testDbId'] = test_object.id
        tempResult['marksObtained'] = str(test_object.id-50) + '.232323'
        data['result'].append(tempResult)

    data['attendance'] = 20

    return data

