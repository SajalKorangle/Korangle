
from parent_test import ParentTestCase

from school_app.handlers.session import get_session_list


class SessionTestCase(ParentTestCase):

    def test_get_session_list(self):

        session_list_response = get_session_list()

        self.assertEqual(len(session_list_response), 3)

        self.assertEqual(session_list_response[0]['dbId'], 1)
        self.assertEqual(session_list_response[0]['name'], 'Session 2017-18')
        self.assertEqual(session_list_response[0]['orderNumber'], 1)

        self.assertEqual(session_list_response[1]['dbId'], 2)
        self.assertEqual(session_list_response[1]['name'], 'Session 2018-19')
        self.assertEqual(session_list_response[1]['orderNumber'], 2)

        self.assertEqual(session_list_response[2]['dbId'], 3)
        self.assertEqual(session_list_response[2]['name'], 'Session 2019-20')
        self.assertEqual(session_list_response[2]['orderNumber'], 3)
