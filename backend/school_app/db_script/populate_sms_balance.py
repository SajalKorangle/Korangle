from sms_app.business.sms_count import get_sms_count


def populate_sms_balance(apps, schema_editor):
    school = apps.get_model('school_app', 'School')

    for school_object in school.objects.all():
        sms_count = get_sms_count(school_object.id)
        school_object.smsBalance = sms_count['count']
