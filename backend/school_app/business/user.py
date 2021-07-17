from django.conf import settings
User = settings.AUTH_USER_MODEL


def create_user(data):

    user_object = User(username=data['username'], password=data['password'], email=data['email'])
    user_object.save()

    return 'User created succcessfully'
