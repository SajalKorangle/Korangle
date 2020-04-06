
# from school_app.model.models import Student
from school_app.model.models import Session
from class_app.models import Division, Class
from student_app.models import Student, StudentSection
from examination_app.models import StudentTestResult, Grade

from django.db.models import Sum

def get_marksheet(data):

    student_object = Student.objects.get(id=data['studentDbId'])
    section_object = Division.objects.get(id=data['sectionDbId'])
    class_object = Class.objects.get(id=data['classDbId'])
    session_object = Session.objects.get(id=data['sessionDbId'])

    response = {}

    response['studentDbId'] = data['studentDbId']
    response['sectionDbId'] = data['sectionDbId']

    school_object = student_object.parentSchool
    '''response['schoolName'] = school_object.name
    response['schoolLogo'] = school_object.logo
    response['schoolAddress'] = school_object.address
    response['schoolDiseCode'] = school_object.diseCode'''

    response['className'] = class_object.name
    response['sectionName'] = section_object.name
    response['sessionName'] = session_object.name

    studentProfile = {}
    '''studentProfile['rollNumber'] = student_object.currentRollNumber'''
    studentProfile['rollNumber'] = student_object.get_rollNumber(session_object)
    studentProfile['name'] = student_object.name
    studentProfile['fathersName'] = student_object.fathersName
    studentProfile['motherName'] = student_object.motherName
    studentProfile['dateOfBirth'] = student_object.dateOfBirth
    studentProfile['address'] = student_object.address
    studentProfile['scholarNumber'] = student_object.scholarNumber
    studentProfile['mobileNumber'] = student_object.mobileNumber
    studentProfile['category'] = student_object.newCategoryField
    studentProfile['childSSMID'] = student_object.childSSMID
    studentProfile['aadharNumber'] = student_object.aadharNum
    response['studentProfile'] = studentProfile

    response['result'] = []
    for student_result_object in StudentTestResult.objects.filter(parentStudent=student_object,
                                                                  parentTest__parentDivision=section_object,
                                                                  parentTest__parentClass=class_object,
                                                                  parentTest__parentSession=session_object)\
            .order_by('parentTest__parentSubject__orderNumber'):
        subject_object = student_result_object.subject
        studentResult = {}
        studentResult['subjectName'] = subject_object.name
        studentResult['governmentSubject'] = subject_object.governmentSubject
        studentResult['maximumMarks'] = student_result_object.maximumMarks
        studentResult['marksObtained'] = student_result_object.marksObtained
        studentResult['grade'] = student_result_object.grade
        response['result'].append(studentResult)

    if len(response['result']) == 0:
        return response

    response['workingDays'] = school_object.workingDays(session_object)
    response['attendance'] = StudentSection.objects.get(parentStudent=student_object,
                                                        parentDivision=section_object,
                                                        parentClass=class_object,
                                                        parentSession=session_object).attendance
    response['overAllGrade'] = get_overall_grade(student_object, section_object, class_object, session_object)

    return response


def get_overall_grade(student_object, section_object, class_object, session_object):

    queryset = StudentTestResult.objects.filter(parentStudent=student_object,
                                                parentTest__parentClass=class_object,
                                                parentTest__parentSession=session_object,
                                                parentTest__parentDivision=section_object,
                                                parentTest__parentSubject__governmentSubject=True)
    totalMaximumMarks = queryset.aggregate(Sum('parentTest__parentMaximumMarks__marks'))['parentTest__parentMaximumMarks__marks__sum']

    querysetTwo = StudentTestResult.objects.filter(parentStudent=student_object,
                                                   parentTest__parentClass=class_object,
                                                   parentTest__parentDivision=section_object,
                                                   parentTest__parentSession=session_object,
                                                   parentTest__parentSubject__governmentSubject=True)
    totalMarksObtained = querysetTwo.aggregate(Sum('marksObtained'))['marksObtained__sum']

    return Grade.objects.get(parentMaximumMarksAllowed__marks=totalMaximumMarks,
                             maximumMarks__gte=totalMarksObtained,
                             minimumMarks__lte=totalMarksObtained).value

