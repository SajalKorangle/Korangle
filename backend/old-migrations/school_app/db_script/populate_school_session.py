
import datetime

def populate_school_session(apps, schema_editor):

    SchoolSession = apps.get_model('school_app', 'SchoolSession')
    School = apps.get_model('school_app', 'School')
    Session = apps.get_model('school_app', 'Session')

    school_object = School.objects.get(name='EKLAVYA')

    today = datetime.date.today()
    session_object = Session.objects.get(startDate__lte=today, endDate__gte=today)

    school_session_object = SchoolSession(parentSchool=school_object,
                                          parentSession=session_object,
                                          workingDays=225)
    school_session_object.save()

def populate_eklavya_dise_code_and_address(apps, schema_editor):

    School = apps.get_model('school_app', 'School')

    school_object = School.objects.get(name='EKLAVYA')

    school_object.diseCode = '23330127966'
    school_object.address = 'Seminary Road, Ashta Dist. Sehore (M.P.)'

    school_object.save()