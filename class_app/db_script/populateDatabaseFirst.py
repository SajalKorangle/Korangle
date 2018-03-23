
from school_app.model.models import Session

from school_app.session import get_current_session_object


def populateClassAppClass(ClassAppClass):

    class_object = ClassAppClass(name='Class - 12',orderNumber=1)
    class_object.save()

    class_object = ClassAppClass(name='Class - 11',orderNumber=2)
    class_object.save()

    class_object = ClassAppClass(name='Class - 10',orderNumber=3)
    class_object.save()

    class_object = ClassAppClass(name='Class - 9',orderNumber=4)
    class_object.save()

    class_object = ClassAppClass(name='Class - 8',orderNumber=5)
    class_object.save()

    class_object = ClassAppClass(name='Class - 7',orderNumber=6)
    class_object.save()

    class_object = ClassAppClass(name='Class - 6',orderNumber=7)
    class_object.save()

    class_object = ClassAppClass(name='Class - 5',orderNumber=8)
    class_object.save()

    class_object = ClassAppClass(name='Class - 4',orderNumber=9)
    class_object.save()

    class_object = ClassAppClass(name='Class - 3',orderNumber=10)
    class_object.save()

    class_object = ClassAppClass(name='Class - 2',orderNumber=11)
    class_object.save()

    class_object = ClassAppClass(name='Class - 1',orderNumber=12)
    class_object.save()

    class_object = ClassAppClass(name='U.K.G.',orderNumber=13)
    class_object.save()

    class_object = ClassAppClass(name='L.K.G.',orderNumber=14)
    class_object.save()

    class_object = ClassAppClass(name='Nursery',orderNumber=15)
    class_object.save()

    class_object = ClassAppClass(name='Play Group',orderNumber=16)
    class_object.save()

def populateClassAppClassSession(ClassAppClassSession, ClassAppClass, SchoolAppSession):
    for class_object in ClassAppClass.objects.all():
        classSession_object = ClassAppClassSession(parentClass=class_object,parentSession=SchoolAppSession.objects.get(id=1))
        classSession_object.save()
        classSession_object = ClassAppClassSession(parentClass=class_object,parentSession=SchoolAppSession.objects.get(id=2))
        classSession_object.save()

def populateClassAppSection(ClassAppSection, ClassAppClassSession):
    for classSession_object in ClassAppClassSession.objects.all():
        section_object = ClassAppSection(name='Section - A', orderNumber=1, parentClassSession=classSession_object)
        section_object.save()

        section_object = ClassAppSection(name='Section - B', orderNumber=2, parentClassSession=classSession_object)
        section_object.save()

        section_object = ClassAppSection(name='Section - C', orderNumber=3, parentClassSession=classSession_object)
        section_object.save()

        section_object = ClassAppSection(name='Section - D', orderNumber=4, parentClassSession=classSession_object)
        section_object.save()

        section_object = ClassAppSection(name='Section - E', orderNumber=5, parentClassSession=classSession_object)
        section_object.save()

        section_object = ClassAppSection(name='Section - F', orderNumber=6, parentClassSession=classSession_object)
        section_object.save()

        section_object = ClassAppSection(name='Section - G', orderNumber=7, parentClassSession=classSession_object)
        section_object.save()

        section_object = ClassAppSection(name='Section - H', orderNumber=8, parentClassSession=classSession_object)
        section_object.save()

        section_object = ClassAppSection(name='Section - I', orderNumber=9, parentClassSession=classSession_object)
        section_object.save()

        section_object = ClassAppSection(name='Section - J', orderNumber=10, parentClassSession=classSession_object)
        section_object.save()

def transferClass(fromClassName, toClassName, sectionName, apps):

    ClassAppSection = apps.get_model('class_app', 'Section')
    SchoolAppStudent = apps.get_model('school_app', 'Student')
    SchoolAppSession = apps.get_model('school_app', 'Session')
    SchoolAppSessionClass = apps.get_model('school_app', 'SessionClass')

    section_object = ClassAppSection.objects.get(name=sectionName,
                                                 parentClassSession__parentSession=SchoolAppSession.objects.get(id=1),
                                                 parentClassSession__parentClass__name=toClassName)

    for sessionClass_object in SchoolAppSessionClass.objects.filter(parentSession=SchoolAppSession.objects.get(id=1),
                                                                    parentClass__name=fromClassName):
        for student_object in SchoolAppStudent.objects.filter(sessionClass=sessionClass_object):
            student_object.friendSection.add(section_object)

def connectSectionAndStudent(apps):

    transferClass('Play Group','Play Group','Section - A',apps)
    transferClass('Nursery','Nursery','Section - A',apps)
    transferClass('L.K.G.','L.K.G.','Section - A',apps)
    transferClass('U.K.G.','U.K.G.','Section - A',apps)

    transferClass('Class - 1','Class - 1','Section - A',apps)
    transferClass('Class - 2','Class - 2','Section - A',apps)
    transferClass('Class - 3','Class - 3','Section - A',apps)
    transferClass('Class - 4','Class - 4','Section - A',apps)
    transferClass('Class - 5','Class - 5','Section - A',apps)
    transferClass('Class - 6','Class - 6','Section - A',apps)
    transferClass('Class - 7','Class - 7','Section - A',apps)
    transferClass('Class - 8','Class - 8','Section - A',apps)

    transferClass('Class - 9','Class - 9','Section - A',apps)
    transferClass('Class - 9 A','Class - 9','Section - A',apps)
    transferClass('Class - 9 B','Class - 9','Section - B',apps)
    transferClass('Class - 9 C','Class - 9','Section - C',apps)

    transferClass('Class - 10','Class - 10','Section - A',apps)
    transferClass('Class - 10 A','Class - 10','Section - A',apps)
    transferClass('Class - 10 B','Class - 10','Section - B',apps)
    transferClass('Class - 10 C','Class - 10','Section - C',apps)

    transferClass('Class - 11','Class - 11','Section - A',apps)
    transferClass('Class - 11, Agri.','Class - 11','Section - D',apps)
    transferClass('Class - 11, Biology','Class - 11','Section - B',apps)
    transferClass('Class - 11, Com.','Class - 11','Section - C',apps)
    transferClass('Class - 11, Maths','Class - 11','Section - A',apps)

    transferClass('Class - 12','Class - 12','Section - A',apps)
    transferClass('Class - 12, Agri.','Class - 12','Section - D',apps)
    transferClass('Class - 12, Biology','Class - 12','Section - B',apps)
    transferClass('Class - 12, Com.','Class - 12','Section - C',apps)
    transferClass('Class - 12, Maths','Class - 12','Section - A',apps)

    transferClass('2016','Class - 1','Section - A',apps)
    transferClass('2017','Class - 2','Section - A',apps)

def populateDatabaseFirst(apps, schema_editor):

    SchoolAppSession = apps.get_model('school_app', 'Session')

    ClassAppClass = apps.get_model('class_app', 'Class')
    ClassAppClassSession = apps.get_model('class_app', 'ClassSession')
    ClassAppSection = apps.get_model('class_app', 'Section')

    populateClassAppClass(ClassAppClass)
    populateClassAppClassSession(ClassAppClassSession,ClassAppClass,SchoolAppSession)
    populateClassAppSection(ClassAppSection,ClassAppClassSession)

    connectSectionAndStudent(apps)
