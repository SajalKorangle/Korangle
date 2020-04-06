
from student_app.models import StudentSection
from examination_app.models import Test, StudentTestResult

def preparingStudentTestResult(number):

    student_section_object = StudentSection.objects.filter(parentStudent__parentSchool__name='EKLAVYA ACADEMY')[0]

    school_object = student_section_object.parentStudent.parentSchool

    data = {}
    data['studentDbId'] = student_section_object.parentStudent.id
    data['sectionDbId'] = student_section_object.parentDivision.id
    data['classDbId'] = student_section_object.parentClass.id
    data['sessionDbId'] = student_section_object.parentSession.id

    data['result'] = []
    for test_object in Test.objects.filter(parentDivision_id=data['sectionDbId'],
                                            parentSession_id=data['sessionDbId'],
                                            parentClass_id=data['classDbId'],
                                           parentSchool=school_object).order_by('parentSubject__orderNumber'):
        tempResult = {}
        tempResult['testDbId'] = test_object.id
        tempResult['marksObtained'] = str(test_object.id-50) + '.' + str(number)
        data['result'].append(tempResult)

    data['attendance'] = number

    return data

def deletingStudentResult():

    student_section_object = StudentSection.objects.filter(parentStudent__parentSchool__name='EKLAVYA ACADEMY')[0]

    data = {}
    data['sectionDbId'] = student_section_object.parentDivision.id
    data['classDbId'] = student_section_object.parentClass.id
    data['sessionDbId'] = student_section_object.parentSession.id
    data['studentDbId'] = student_section_object.parentStudent.id

    StudentTestResult.objects.filter(parentTest__parentDivision_id=data['sectionDbId'],
                                     parentTest__parentClass_id=data['classDbId'],
                                     parentTest__parentSession_id=data['sessionDbId'],
                                     parentStudent_id=data['studentDbId']).delete()

    return data

def deletingAndPreparingStudentResult():

    student_section_object = StudentSection.objects.filter(parentStudent__parentSchool__name='EKLAVYA ACADEMY')[0]

    school_object = student_section_object.parentStudent.parentSchool

    data = {}
    data['sectionDbId'] = student_section_object.parentDivision.id
    data['classDbId'] = student_section_object.parentClass.id
    data['sessionDbId'] = student_section_object.parentSession.id
    data['studentDbId'] = student_section_object.parentStudent.id

    StudentTestResult.objects.filter(parentTest__parentDivision_id=data['sectionDbId'],
                                     parentTest__parentClass_id=data['classDbId'],
                                     parentTest__parentSession_id=data['sessionDbId'],
                                     parentStudent_id=data['studentDbId']).delete()

    data['result'] = []
    for test_object in Test.objects.filter(parentDivision_id=data['sectionDbId'],
                                            parentClass_id=data['classDbId'],
                                            parentSession_id=data['sessionDbId'],
                                           parentSchool=school_object):
        tempResult = {}
        tempResult['testDbId'] = test_object.id
        tempResult['marksObtained'] = str(test_object.id-50) + '.232323'
        data['result'].append(tempResult)

    data['attendance'] = 20

    return data

