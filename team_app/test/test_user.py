
from parent_test import ParentTestCase

# Models
from django.contrib.auth.models import User

# Business
from team_app.business.user import get_user_list


class UserTestCase(ParentTestCase):

    def test_get_user_list(self):

        response = get_user_list()

        user_querset = User.objects.all()

        self.assertEqual(len(response), user_querset.count())

        index = 0
        for user_object in user_querset.order_by('username'):
            self.assertEqual(response[index]['dbId'], user_object.id)
            self.assertEqual(response[index]['username'], user_object.username)
            index += 1
