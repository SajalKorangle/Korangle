
from examination_app.db_script.populate_brightstar_marksheet import populate_test

def populate_brightstar_for_marksheet(apps, schema_editor):

    populate_brightstar_schoolsession(apps, schema_editor)

    populate_brightstar_details(apps, schema_editor)

    populate_test(apps, schema_editor)

def populate_brightstar_schoolsession(apps, schema_editor):

    SchoolSession = apps.get_model('school_app', 'SchoolSession')
    School = apps.get_model('school_app', 'School')
    Session = apps.get_model('school_app', 'Session')

    brightstar_object = School.objects.get(user__username='brightstarsalsalai')

    session_object = Session.objects.get(name='Session 2017-18')

    schoolSession = SchoolSession(parentSchool=brightstar_object, parentSession=session_object, workingDays=224)

    schoolSession.save()

def populate_brightstar_details(apps, schema_editor):

    School = apps.get_model('school_app', 'School')

    brightstar_object = School.objects.get(user__username='brightstarsalsalai')

    brightstar_object.registrationNumber = '426/13.01.1993'
    brightstar_object.printName = 'Bright Star Hr. Sec. School'
    brightstar_object.diseCode = '23220401315'
    brightstar_object.address = 'Salsalai'

    brightstar_object.save()

    bhagatsingh_object = School.objects.filter(user__username='bhagatsingh')[0]

    bhagatsingh_object.registrationNumber = '5464/98'

    bhagatsingh_object.save()

def change_100_marks_grade(apps, schema_editor):

    Grade = apps.get_model('examination_app', 'Grade')

    grade_object = Grade.objects.get(parentMaximumMarksAllowed__marks=100,
                                     value='A')
    grade_object.maximumMarks = 100
    grade_object.minimumMarks = 75
    grade_object.save()

    grade_object = Grade.objects.get(parentMaximumMarksAllowed__marks=100,
                                     value='B')
    grade_object.maximumMarks = 74.9
    grade_object.minimumMarks = 60
    grade_object.save()

    grade_object = Grade.objects.get(parentMaximumMarksAllowed__marks=100,
                                     value='C')
    grade_object.maximumMarks = 59.9
    grade_object.minimumMarks = 45
    grade_object.save()

    grade_object = Grade.objects.get(parentMaximumMarksAllowed__marks=100,
                                     value='D')
    grade_object.maximumMarks = 44.9
    grade_object.minimumMarks = 33
    grade_object.save()

    grade_object = Grade.objects.get(parentMaximumMarksAllowed__marks=100,
                                     value='E')
    grade_object.maximumMarks = 32.9
    grade_object.minimumMarks = 0
    grade_object.save()

