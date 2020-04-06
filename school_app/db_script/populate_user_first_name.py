

def populate_user_first_name(apps, schema_editor):

    User = apps.get_model('auth', 'User')

    for user_object in User.objects.all():

        name = user_object.username
        first_name = name.capitalize()
        user_object.first_name = first_name
        user_object.save()

