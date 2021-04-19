def populate_sms_id(apps, schema_editor):
    school = apps.get_model('school_app', 'School')
    sms_id = apps.get_model('sms_app', 'SMSId')

    for school_object in school.objects.exclude(smsId='KORNGL').exclude(smsId='TBTSIG'):
        new_sms_id = sms_id(parentSchool=school_object, smsId=school_object.smsId, smsIdStatus='ACTIVATED')
        new_sms_id.save()

