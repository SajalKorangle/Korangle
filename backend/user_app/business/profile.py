
from django.contrib.auth import get_user_model
User = get_user_model()


def update_profile(data):

    user_object = User.objects.get(id=data['id'])
    user_object.first_name = data['first_name']
    user_object.last_name = data['last_name']
    user_object.email = data['email']
    user_object.save()

    return 'Profile updated successfully'


def change_password(data):

    user = User.objects.get(id=data['id'])
    if not user.check_password(data['oldPassword']):
        return 'Old password incorrect'

    user.set_password(data['newPassword'])
    user.save()

    return 'Password updated successfully'
