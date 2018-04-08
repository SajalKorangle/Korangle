
from examination_app.db_script.constants import initialize_brightstar_test

def populate_test(apps, schema_editor):

    MaximumMarksAllowed = apps.get_model('examination_app', 'MaximumMarksAllowed')
    Subject = apps.get_model('subject_app', 'Subject')
    Test = apps.get_model('examination_app', 'Test')
    School = apps.get_model('school_app', 'School')
    Section = apps.get_model('class_app', 'Section')
    Session = apps.get_model('school_app', 'Session')

    for test in initialize_brightstar_test:

        session_object = Session.objects.get(name='Session 2017-18')

        subject_object = Subject.objects.get(name=test['subject'])
        maxMarks_object = MaximumMarksAllowed.objects.get(marks=test['marks'])
        school_object = School.objects.get(user__username='brightstarsalsalai')

        for section_object in Section.objects.filter(parentClassSession__parentSession=session_object,
                                                     parentClassSession__parentClass__name=test['className']):
            if section_object.studentsection_set.filter(parentStudent__parentUser__username='brightstarsalsalai').count() > 0:
                test_object = Test(parentSubject=subject_object,
                                   parentSection=section_object,
                                   parentMaximumMarks=maxMarks_object,
                                   parentSchool=school_object)
                test_object.save()
