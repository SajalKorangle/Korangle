
from parent_test import ParentTestCase

# Business
from school_app.business.user import create_user

# Models
from django.conf import settings
User = settings.AUTH_USER_MODEL


class UserTestCase(ParentTestCase):

    def test_create_user(self):

        data = {
            'username': 'testingnow',
            'password': 'test',
            'email': 'whatkindofmail@gmail.com',
        }

        create_user(data)

        User.objects.get(username='testingnow')
