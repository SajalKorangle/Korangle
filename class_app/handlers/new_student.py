
from class_app.models import Class, ClassSession, Section

# from school_app.session import get_current_session_object

from school_app.model.models import Session

def get_class_section_list(data):

    class_section_list = []

    session_object = Session.objects.get(id=data['sessionDbId'])

    for classSession_object in ClassSession.objects.filter(parentSession=session_object):
        tempClass = {}
        tempClass['name'] = classSession_object.parentClass.name
        tempClass['dbId'] = classSession_object.parentClass.id
        tempClass['sectionList'] = []
        for section_object in Section.objects.filter(parentClassSession=classSession_object):
            tempSection = {}
            tempSection['name'] = section_object.name
            tempSection['dbId'] = section_object.id
            tempClass['sectionList'].append(tempSection)
        class_section_list.append(tempClass)

    return class_section_list
