from django.contrib.auth import get_user_model
User = get_user_model()


def create_user(data):

    user_object = User(username=data['username'], password=data['password'], email=data['email'])
    user_object.save()

    return 'User created succcessfully'
