
from parent_test import ParentTestCase

# Factory

# Business
from user_app.business.profile import change_password, update_profile

# Model
from django.contrib.auth.models import User


class ProfileTestCase(ParentTestCase):

    def test_update_profile(self):

        user = User.objects.filter()[0]

        data = {
            'id': user.id,
            'first_name': 'First Name',
            'last_name': 'Last Name',
            'email': 'Email',
        }

        response = update_profile(data)

        user = User.objects.get(id=data['id'])

        self.assertEqual(user.id, data['id'])
        self.assertEqual(user.first_name, data['first_name'])
        self.assertEqual(user.last_name, data['last_name'])
        self.assertEqual(user.email, data['email'])

    def test_change_password(self):

        user = User.objects.filter()[0]

        old_password = 'Old Password'

        user.set_password(old_password)
        user.save()

        data = {
            'id': user.id,
            'oldPassword': old_password,
            'newPassword': 'New Password',
        }

        response = change_password(data)

        user = User.objects.get(id=data['id'])

        self.assertEqual(user.id, data['id'])
        self.assertEqual(user.check_password(data['newPassword']), True)
