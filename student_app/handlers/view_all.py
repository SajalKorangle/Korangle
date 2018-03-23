
from class_app.models import ClassSession, Section

from school_app.session import get_current_session_object

from student_app.models import StudentSection

from student_app.handlers.common import get_student_profile

def get_class_section_student_profile_list(user):

    # student_profile_list = []

    class_section_student_profile_list = []

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
            for student_section_object in StudentSection.objects.filter(parentStudent__parentUser=user,parentSection=section_object):
                tempSection['studentList'].append(get_student_profile(student_section_object.parentStudent))
            if len(tempSection['studentList']) > 0:
                tempClass['sectionList'].append(tempSection)
        if len(tempClass['sectionList']) > 0:
            class_section_student_profile_list.append(tempClass)

    '''response = {}
    response['studentList'] = student_profile_list
    response['classSectionList'] = class_section_list'''


    return class_section_student_profile_list
