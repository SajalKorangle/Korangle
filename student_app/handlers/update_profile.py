
from student_app.models import StudentSection, Student
from student_app.handlers import common
from student_app.handlers.common import populate_student_field

from school_app.model.models import Session

from class_app.models import Class, Division

from django.db.models import ProtectedError


def get_class_section_student_list(data):

    class_section_student_list = []

    session_object = Session.objects.get(id=data['sessionDbId'])

    for class_object in Class.objects.all().order_by('orderNumber'):
        tempClass = {}
        tempClass['name'] = class_object.name
        tempClass['dbId'] = class_object.id
        tempClass['sectionList'] = []
        for section_object in Division.objects.all().order_by('orderNumber'):
            tempSection = {}
            tempSection['name'] = section_object.name
            tempSection['dbId'] = section_object.id
            tempSection['studentList'] = []
            for student_section_object in StudentSection.objects.filter(parentStudent__parentSchool_id=data['schoolDbId'],
                                                                        parentDivision=section_object,
                                                                        parentClass=class_object,
                                                                        parentSession=session_object).order_by('parentStudent__name'):
                tempStudent = {}
                tempStudent['name'] = student_section_object.parentStudent.name
                tempStudent['dbId'] = student_section_object.parentStudent.id
                tempStudent['scholarNumber'] = student_section_object.parentStudent.scholarNumber
                tempStudent['parentTransferCertificate'] = student_section_object.parentStudent.parentTransferCertificate_id
                tempSection['studentList'].append(tempStudent)
            if len(tempSection['studentList']) > 0:
                tempClass['sectionList'].append(tempSection)
        if len(tempClass['sectionList']) > 0:
            class_section_student_list.append(tempClass)

    return class_section_student_list


def get_student_profile(data):
    return common.get_student_profile(Student.objects.get(id=data['studentDbId']),
                                      Session.objects.get(id=data['sessionDbId']))


def update_student(data):

    student_object = Student.objects.get(id=data['dbId'])

    for key in data:
        if key != 'sectionDbId' and key != 'classDbId' and key != 'sessionDbId':
            populate_student_field(student_object, key, data[key])

    student_object.save()

    if 'rollNumber' in data:
        student_section_object = StudentSection.objects\
            .get(parentStudent=student_object,
                 parentDivision_id=data['sectionDbId'],
                 parentClass_id=data['classDbId'],
                 parentSession_id=data['sessionDbId'])
        student_section_object.rollNumber = data['rollNumber']
        student_section_object.save()

    return common.get_student_profile(student_object,Session.objects.get(id=data['sessionDbId']))


def delete_student(data):

    try:
        Student.objects.filter(pk=data['studentDbId']).delete()

        response = {}
        response['studentDbId'] = data['studentDbId']
        response['message'] = 'Student Profile removed successfully.'
        return response
    except ProtectedError:

        response = {}
        response['studentDbId'] = 0
        response['message'] = 'Not able to delete Student Profile'
        return response
