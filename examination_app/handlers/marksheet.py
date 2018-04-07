
# from school_app.model.models import Student
from class_app.models import Section
from student_app.models import Student, StudentSection
from examination_app.models import StudentTestResult, Grade

from django.db.models import Sum

def get_marksheet(data):

    student_object = Student.objects.get(id=data['studentDbId'])
    section_object = Section.objects.get(id=data['sectionDbId'])
    session_object = section_object.parentClassSession.parentSession

    response = {}

    response['studentDbId'] = data['studentDbId']
    response['sectionDbId'] = data['sectionDbId']

    school_object = student_object.school
    '''response['schoolName'] = school_object.name
    response['schoolLogo'] = school_object.logo
    response['schoolAddress'] = school_object.address
    response['schoolDiseCode'] = school_object.diseCode'''

    response['className'] = section_object.className
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
                                                                  parentTest__parentSection=section_object)\
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
    response['attendance'] = StudentSection.objects.get(parentStudent=student_object, parentSection=section_object).attendance
    response['overAllGrade'] = get_overall_grade(student_object,section_object)

    return response

def get_overall_grade(student_object, section_object):

    totalMaximumMarks = StudentTestResult.objects.filter(parentStudent=student_object,
                                                         parentTest__parentSection=section_object,
                                                         parentTest__parentSubject__governmentSubject=True)\
        .aggregate(Sum('parentTest__parentMaximumMarks__marks'))['parentTest__parentMaximumMarks__marks__sum']

    totalMarksObtained = StudentTestResult.objects.filter(parentStudent=student_object,
                                                         parentTest__parentSection=section_object,
                                                         parentTest__parentSubject__governmentSubject=True)\
        .aggregate(Sum('marksObtained'))['marksObtained__sum']

    return Grade.objects.get(parentMaximumMarksAllowed__marks=totalMaximumMarks,
                             maximumMarks__gte=totalMarksObtained,
                             minimumMarks__lte=totalMarksObtained).value

