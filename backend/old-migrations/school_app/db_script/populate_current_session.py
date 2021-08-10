
from django.contrib.auth.models import User

from school_app.model.models import Session

from django.db.models import Q

def populate_current_session(apps, schema_editor):

    school_object = User.objects.get(username='brightstar').school_set.all()[0]
    school_object.currentSession = Session.objects.get(name='Session 2017-18')
    school_object.save()

    school_object = User.objects.get(username='brightstar').school_set.all()[0]
    school_object.currentSession = Session.objects.get(name='Session 2017-18')
    school_object.save()

    school_object = User.objects.get(username='brighthindi').school_set.all()[0]
    school_object.currentSession = Session.objects.get(name='Session 2017-18')
    school_object.save()

    school_object = User.objects.get(username='anupreet').school_set.all()[0]
    school_object.currentSession = Session.objects.get(name='Session 2017-18')
    school_object.save()

    school_object = User.objects.get(username='brightstarsalsalai').school_set.all()[0]
    school_object.currentSession = Session.objects.get(name='Session 2017-18')
    school_object.save()

    school_object = User.objects.get(username='eklavya').school_set.all()[0]
    school_object.currentSession = Session.objects.get(name='Session 2017-18')
    school_object.save()

    school_object = User.objects.get(username='demo').school_set.all()[0]
    school_object.currentSession = Session.objects.get(name='Session 2017-18')
    school_object.save()

    school_object = User.objects.get(username='madhav').school_set.all()[0]
    school_object.currentSession = Session.objects.get(name='Session 2017-18')
    school_object.save()

    school_object = User.objects.get(username='talent').school_set.all()[0]
    school_object.currentSession = Session.objects.get(name='Session 2018-19')
    school_object.save()

    school_object = User.objects.get(username='champion').school_set.all()[0]
    school_object.currentSession = Session.objects.get(name='Session 2018-19')
    school_object.save()

    school_object = User.objects.get(username='bhagatsingh').school_set.all()[0]
    school_object.currentSession = Session.objects.get(name='Session 2018-19')
    school_object.save()

def shift_student(apps, schema_editor):

    for user_object in User.objects.filter(Q(username='talent') |
                                           Q(username='champion') |
                                           Q(username='bhagatsingh')):
        for student_object in user_object.student_set.all():
            student_section_object = student_object.studentsection_set.get()
            classDbId = student_section_object.parentSection.parentClassSession.parentClass.id
            sessionDbId = student_section_object.parentSection.parentClassSession.parentSession.id
            sectionName = student_section_object.parentSection.name
            if sessionDbId != Session.objects.get(name='Session 2017-18').id :
                print('Error: in assumption of previous session id')
            sessionDbId = Session.objects.get(name='Session 2018-19').id
            new_section_object = Section.objects.get(parentClassSession__parentClass__id=classDbId,
                                                     parentClassSession__parentSession__id=sessionDbId,
                                                     name=sectionName)
            student_section_object.parentSection = new_section_object
            student_section_object.save()

