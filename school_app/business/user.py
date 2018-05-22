
from django.contrib.auth.models import User


def create_user(data):

    user_object = User(username=data['username'], password=data['password'], email=data['email'])
    user_object.save()

    return 'User created succcessfully'
