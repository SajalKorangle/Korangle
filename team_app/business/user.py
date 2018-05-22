
from django.contrib.auth.models import User


def get_user_list():

    user_list = []

    for user_object in User.objects.all().order_by('username'):

        user_response = {}
        user_response['dbId'] = user_object.id
        user_response['username'] = user_object.username

        user_list.append(user_response)

    return user_list
