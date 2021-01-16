from datetime import date


def populate_expiry_date(apps, schema_editor):
    school = apps.get_model('school_app', 'School')
    today = date.today()

    for school_object in school.objects.all():
        expiry_date = school_object.dateOfExpiration
        if expiry_date > today:
            school_object.expired = False
            school_object.save()
        else:
            school_object.expired = True
            school_object.save()
