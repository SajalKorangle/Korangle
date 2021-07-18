
from parent_test import ParentTestCase

# Business
from school_app.business.user import create_user

# Models
from django.contrib.auth import get_user_model
User = get_user_model()


class UserTestCase(ParentTestCase):

    def test_create_user(self):

        data = {
            'username': 'testingnow',
            'password': 'test',
            'email': 'whatkindofmail@gmail.com',
        }

        create_user(data)

        User.objects.get(username='testingnow')
