

def add_profile_images(apps, schema_editor):

    School = apps.get_model('school_app', 'School')

    for school_object in School.objects.all():

        school_object.profileImage = "schools/" \
                                     + str(school_object.id) + "/main." + school_object.logo.url[-3:]

        school_object.save()
