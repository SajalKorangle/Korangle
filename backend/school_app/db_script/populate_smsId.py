def populate_sms_id(apps, schema_editor):
    school = apps.get_model('school_app', 'School')
    sms_id = apps.get_model('school_app', 'SMSId')

    for school_object in school.objects.all():
        if school_object.smsId == 'KORNGL' or school_object.smsId == 'TBTSIG':
            new_sms_id = sms_id(parentSchool=school_object, smsId='KORNGL', smsIdStatus='NOT REGISTERED')
        else:
            new_sms_id = sms_id(parentSchool=school_object, smsId=school_object.smsId, smsIdStatus='ACTIVATED')
        new_sms_id.save()

