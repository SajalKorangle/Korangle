
# from class_app.handlers.new_student import get_class_section_list

from school_app.model.models import Student, SubFee, Fee, Concession

from student_app.models import StudentSection

from student_app.handlers.common import get_student_profile

from student_app.handlers import common

from school_app.session import get_current_session_object

from class_app.models import ClassSession, Section
from student_app.handlers.common import populate_student_field

def get_class_section_student_list(user):

    class_section_student_list = []

    for classSession_object in ClassSession.objects.filter(parentSession=get_current_session_object()).order_by('parentClass__orderNumber'):
        tempClass = {}
        tempClass['name'] = classSession_object.parentClass.name
        tempClass['dbId'] = classSession_object.parentClass.id
        tempClass['sectionList'] = []
        for section_object in Section.objects.filter(parentClassSession=classSession_object).order_by('orderNumber'):
            tempSection = {}
            tempSection['name'] = section_object.name
            tempSection['dbId'] = section_object.id
            tempSection['studentList'] = []
            for student_section_object in StudentSection.objects.filter(parentStudent__parentUser=user,parentSection=section_object).order_by('parentStudent__name'):
                tempStudent = {}
                tempStudent['name'] = student_section_object.parentStudent.name
                tempStudent['dbId'] = student_section_object.parentStudent.id
                tempSection['studentList'].append(tempStudent)
            if len(tempSection['studentList']) > 0:
                tempClass['sectionList'].append(tempSection)
        if len(tempClass['sectionList']) > 0:
            class_section_student_list.append(tempClass)

    return class_section_student_list

def get_student_profile(data):
    return common.get_student_profile(Student.objects.get(id=data['studentDbId']))

def update_student(data):
    '''updatedValues = {}
    updatedValues['name'] = data['name']
    updatedValues['fathersName'] = data['fathersName']
    updatedValues['mobileNumber'] = data['mobileNumber']
    updatedValues['dateOfBirth'] = data['dateOfBirth']
    if data['totalFees']:
        updatedValues['totalFees'] = data['totalFees']
    else:
        updatedValues['totalFees'] = 0
    updatedValues['remark'] = data['remark']
    updatedValues['rollNumber'] = data['rollNumber']
    updatedValues['scholarNumber'] = data['scholarNumber']
    updatedValues['motherName'] = data['motherName']
    updatedValues['gender'] = data['gender']
    updatedValues['caste'] = data['caste']
    updatedValues['newCategoryField'] = data['category']
    updatedValues['newReligionField'] = data['religion']
    updatedValues['fatherOccupation'] = data['fatherOccupation']
    updatedValues['address'] = data['address']
    updatedValues['familySSMID'] = data['familySSMID']
    updatedValues['childSSMID'] = data['childSSMID']
    updatedValues['bankAccountNum'] = data['bankAccountNum']
    updatedValues['bankName'] = data['bankName']
    updatedValues['aadharNum'] = data['aadharNum']
    updatedValues['fatherAnnualIncome'] = data['fatherAnnualIncome']
    updatedValues['bloodGroup'] = data['bloodGroup']

    student_object, created = Student.objects.update_or_create(defaults=updatedValues, id=data['dbId'])
    return get_student_profile(student_object)'''

    student_object = Student.objects.get(id=data['dbId'])

    for key in data:
        if key != 'sectionDbId':
            populate_student_field(student_object, key, data[key])

    student_object.save()

    if 'rollNumber' in data:
        student_section_object = StudentSection.objects\
            .get(parentStudent=student_object,
                 parentSection__parentClassSession__parentSession=get_current_session_object())
        student_section_object.rollNumber = data['rollNumber']
        student_section_object.save()

    return common.get_student_profile(student_object)


def delete_student(data):

    student_object = Student.objects.get(id=data['studentDbId'])
    SubFee.objects.filter(parentFee__parentStudent=student_object).delete()
    Fee.objects.filter(parentStudent=student_object).delete()
    Concession.objects.filter(parentStudent=student_object).delete()
    StudentSection.objects.filter(parentStudent=student_object).delete()
    Student.objects.filter(pk=data['studentDbId']).delete()

    response = {}
    response['studentDbId'] = data['studentDbId']
    response['message'] = 'Student Profile removed successfully.'
    return response
