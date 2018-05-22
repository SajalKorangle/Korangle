
from parent_test import ParentTestCase

# Business
from school_app.business.user import create_user

# Models
from django.contrib.auth.models import User


class UserTestCase(ParentTestCase):

    def test_create_user(self):

        data = {
            'username': 'testingnow',
            'password': 'test',
            'email': 'whatkindofmail@gmail.com',
        }

        create_user(data)

        User.objects.get(username='testingnow')
