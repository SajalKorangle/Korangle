
def populate_school_header_size(apps, schema_editor):

    School = apps.get_model('school_app', 'School')

    for school_object in School.objects.filter(printName='Bright Star Hr. Sec. School'):
        school_object.headerSize = 'BIG'
        school_object.save()
