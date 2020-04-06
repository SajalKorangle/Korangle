
from parent_test import ParentTestCase

# Models
from school_app.model.models import Session, School

# factories
from school_app.factory.school import SchoolFactory

# business
from school_app.handlers.school_profile import get_school_profile_by_object, update_school_profile


class SchoolProfileTestCase(ParentTestCase):

    def test_get_school_profile_by_object(self):

        school_object = SchoolFactory()

        response = get_school_profile_by_object(school_object)

        self.assertEqual(school_object.name, response['name'])
        self.assertEqual(school_object.printName, response['printName'])
        self.assertEqual(school_object.diseCode, response['diseCode'])
        self.assertEqual(school_object.address, response['address'])
        self.assertEqual(school_object.registrationNumber, response['registrationNumber'])
        self.assertEqual(school_object.affiliationNumber, response['affiliationNumber'])
        self.assertEqual(school_object.currentSession.id, response['currentSessionDbId'])

    def test_update_school_profile(self):

        school_object = SchoolFactory()

        session_object = Session.objects.get(name='Session 2018-19')

        data = {
            'dbId': school_object.id,
            'name': 'New Name',
            'printName': 'New Print Name',
            'mobileNumber': 7999951154,
            'diseCode': 'New Dise Code',
            'address': 'New Address',
            'registrationNumber': 'New Registration Number',
            'affiliationNumber': '---',
            'currentSessionDbId': session_object.id,
        }

        update_school_profile(data)

        new_school_object = School.objects.get(id=data['dbId'])

        self.assertEqual(new_school_object.name, data['name'])
        self.assertEqual(new_school_object.printName, data['printName'])
        self.assertEqual(new_school_object.mobileNumber, data['mobileNumber'])
        self.assertEqual(new_school_object.diseCode, data['diseCode'])
        self.assertEqual(new_school_object.address, data['address'])
        self.assertEqual(new_school_object.registrationNumber, data['registrationNumber'])
        self.assertEqual(new_school_object.affiliationNumber, data['affiliationNumber'])
        self.assertEqual(new_school_object.currentSession.id, data['currentSessionDbId'])

