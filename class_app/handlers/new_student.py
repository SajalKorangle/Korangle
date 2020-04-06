
from class_app.models import Class, Division

# from school_app.session import get_current_session_object

from school_app.model.models import Session


def get_class_section_list(data):

    class_section_list = []

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
            tempClass['sectionList'].append(tempSection)
        class_section_list.append(tempClass)

    '''for classSession_object in ClassSession.objects.filter(parentSession=session_object):
        tempClass = {}
        tempClass['name'] = classSession_object.parentClass.name
        tempClass['dbId'] = classSession_object.parentClass.id
        tempClass['sectionList'] = []
        for section_object in Section.objects.filter(parentClassSession=classSession_object):
            tempSection = {}
            tempSection['name'] = section_object.name
            tempSection['dbId'] = section_object.id
            tempClass['sectionList'].append(tempSection)
        class_section_list.append(tempClass)'''

    return class_section_list
