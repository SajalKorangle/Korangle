
from examination_app.db_script.constants import initialize_eklavya_test

from school_app.session import get_current_session_object

import datetime

def populate_test(apps, schema_editor):

    MaximumMarksAllowed = apps.get_model('examination_app', 'MaximumMarksAllowed')
    Subject = apps.get_model('subject_app', 'Subject')
    Test = apps.get_model('examination_app', 'Test')
    School = apps.get_model('school_app', 'School')
    Section = apps.get_model('class_app', 'Section')
    Session = apps.get_model('school_app', 'Session')

    for test in initialize_eklavya_test:

        today = datetime.date.today()
        session_object = Session.objects.get(startDate__lte=today, endDate__gte=today)

        subject_object = Subject.objects.get(name=test['subject'])
        section_object = Section.objects.get(parentClassSession__parentSession=session_object,
                                             parentClassSession__parentClass__name=test['className'],
                                             name='Section - A')
        maxMarks_object = MaximumMarksAllowed.objects.get(marks=test['marks'])
        school_object = School.objects.get(name='EKLAVYA')

        test_object = Test(parentSubject=subject_object,
                           parentSection=section_object,
                           parentMaximumMarks=maxMarks_object,
                           parentSchool=school_object)
        test_object.save()




