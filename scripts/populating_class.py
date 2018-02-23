from django.contrib.auth.models import User

from school_app.models import Session, Class, SessionClass

from school_app.session import get_current_session_object

user_object = User.objects.get(username='talent')

if len(user_object.class_set.all()) == 0:
    class_object = Class(name='Class - 12',orderNumber=1,parentUser=user_object)
    class_object.save()
    sessionClass_object = SessionClass(parentSession=get_current_session_object(), parentClass=class_object)
    sessionClass_object.save()

    class_object = Class(name='Class - 11',orderNumber=2,parentUser=user_object)
    class_object.save()
    sessionClass_object = SessionClass(parentSession=get_current_session_object(), parentClass=class_object)
    sessionClass_object.save()

    class_object = Class(name='Class - 10',orderNumber=3,parentUser=user_object)
    class_object.save()
    sessionClass_object = SessionClass(parentSession=get_current_session_object(), parentClass=class_object)
    sessionClass_object.save()

    class_object = Class(name='Class - 9',orderNumber=4,parentUser=user_object)
    class_object.save()
    sessionClass_object = SessionClass(parentSession=get_current_session_object(), parentClass=class_object)
    sessionClass_object.save()

    class_object = Class(name='Class - 8',orderNumber=5,parentUser=user_object)
    class_object.save()
    sessionClass_object = SessionClass(parentSession=get_current_session_object(), parentClass=class_object)
    sessionClass_object.save()

    class_object = Class(name='Class - 7',orderNumber=6,parentUser=user_object)
    class_object.save()
    sessionClass_object = SessionClass(parentSession=get_current_session_object(), parentClass=class_object)
    sessionClass_object.save()

    class_object = Class(name='Class - 6',orderNumber=7,parentUser=user_object)
    class_object.save()
    sessionClass_object = SessionClass(parentSession=get_current_session_object(), parentClass=class_object)
    sessionClass_object.save()

    class_object = Class(name='Class - 5',orderNumber=8,parentUser=user_object)
    class_object.save()
    sessionClass_object = SessionClass(parentSession=get_current_session_object(), parentClass=class_object)
    sessionClass_object.save()

    class_object = Class(name='Class - 4',orderNumber=9,parentUser=user_object)
    class_object.save()
    sessionClass_object = SessionClass(parentSession=get_current_session_object(), parentClass=class_object)
    sessionClass_object.save()

    class_object = Class(name='Class - 3',orderNumber=10,parentUser=user_object)
    class_object.save()
    sessionClass_object = SessionClass(parentSession=get_current_session_object(), parentClass=class_object)
    sessionClass_object.save()

    class_object = Class(name='Class - 2',orderNumber=11,parentUser=user_object)
    class_object.save()
    sessionClass_object = SessionClass(parentSession=get_current_session_object(), parentClass=class_object)
    sessionClass_object.save()

    class_object = Class(name='Class - 1',orderNumber=12,parentUser=user_object)
    class_object.save()
    sessionClass_object = SessionClass(parentSession=get_current_session_object(), parentClass=class_object)
    sessionClass_object.save()

    class_object = Class(name='U.K.G.',orderNumber=13,parentUser=user_object)
    class_object.save()
    sessionClass_object = SessionClass(parentSession=get_current_session_object(), parentClass=class_object)
    sessionClass_object.save()

    class_object = Class(name='L.K.G.',orderNumber=14,parentUser=user_object)
    class_object.save()
    sessionClass_object = SessionClass(parentSession=get_current_session_object(), parentClass=class_object)
    sessionClass_object.save()

    class_object = Class(name='Nursery',orderNumber=15,parentUser=user_object)
    class_object.save()
    sessionClass_object = SessionClass(parentSession=get_current_session_object(), parentClass=class_object)
    sessionClass_object.save()

    class_object = Class(name='Play Group',orderNumber=16,parentUser=user_object)
    class_object.save()
    sessionClass_object = SessionClass(parentSession=get_current_session_object(), parentClass=class_object)
    sessionClass_object.save()
