
# from class_app.handlers.new_student import get_class_section_list

from school_app.model.models import Student, SubFee, Fee, Concession

from student_app.models import StudentSection

from student_app.handlers.common import get_student_profile

from student_app.handlers import common

# from school_app.session import get_current_session_object

from school_app.model.models import Session

from class_app.models import ClassSession, Section
from student_app.handlers.common import populate_student_field

def get_class_section_student_list(data, user):

    class_section_student_list = []

    session_object = Session.objects.get(id=data['sessionDbId'])

    for classSession_object in ClassSession.objects.filter(parentSession=session_object).order_by('parentClass__orderNumber'):
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
    return common.get_student_profile(Student.objects.get(id=data['studentDbId']),
                                      Section.objects.get(id=data['sectionDbId']).parentClassSession.parentSession)

def update_student(data):

    student_object = Student.objects.get(id=data['dbId'])

    for key in data:
        if key != 'sectionDbId':
            populate_student_field(student_object, key, data[key])

    student_object.save()

    if 'rollNumber' in data:
        '''student_section_object = StudentSection.objects\
            .get(parentStudent=student_object,
                 parentSection__parentClassSession__parentSession=get_current_session_object())'''
        student_section_object = StudentSection.objects\
            .get(parentStudent=student_object,
                 parentSection_id=data['sectionDbId'])
        student_section_object.rollNumber = data['rollNumber']
        student_section_object.save()

    return common.get_student_profile(student_object,
                                      Section.objects.get(id=data['sectionDbId']).parentClassSession.parentSession)


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
