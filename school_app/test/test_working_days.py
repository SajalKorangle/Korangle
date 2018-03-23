from parent_test import ParentTestCase

from school_app.handlers.working_days import get_working_days, create_working_days, update_working_days

from school_app.model.models import SchoolSession, School, Session

import json

class SchoolSessionTestCase(ParentTestCase):

    def test_get_working_days_with_value(self):

        data = {}
        data['schoolDbId'] = School.objects.all()[0].id
        data['sessionDbId'] = Session.objects.all()[0].id

        school_session_object, created = SchoolSession.objects.get_or_create(parentSession_id=data['sessionDbId'], parentSchool_id=data['schoolDbId'])
        school_session_object.workingDays = 10
        school_session_object.save()

        response = get_working_days(data)

        self.assertEqual(response['schoolSessionDbId'], school_session_object.id)
        self.assertEqual(response['workingDays'], school_session_object.workingDays)

    def test_get_working_days_with_null(self):

        data = {}
        data['schoolDbId'] = School.objects.all()[0].id
        data['sessionDbId'] = Session.objects.all()[0].id

        SchoolSession.objects.filter(parentSession=data['sessionDbId'], parentSchool=data['schoolDbId']).delete()

        response = get_working_days(data)

        self.assertEqual(response, None)

    def test_create_working_days(self):

        data = {}
        data['schoolDbId'] = School.objects.all()[0].id
        data['sessionDbId'] = Session.objects.all()[0].id
        data['workingDays'] = 12

        SchoolSession.objects.filter(parentSession=data['sessionDbId'], parentSchool=data['schoolDbId']).delete()

        response = create_working_days(data)

        school_session_object = SchoolSession.objects.get(parentSession=data['sessionDbId'], parentSchool=data['schoolDbId'])
        self.assertEqual(response['schoolSessionDbId'], school_session_object.id)
        self.assertEqual(response['workingDays'], school_session_object.workingDays)

    def test_update_working_days(self):

        school_session_object, created = SchoolSession.objects.get_or_create(parentSession=Session.objects.all()[0], parentSchool=School.objects.all()[0])
        school_session_object.workingDays = 10
        school_session_object.save()

        data = {}
        data['schoolSessionDbId'] = school_session_object.id
        data['workingDays'] = 12

        response = update_working_days(data)

        self.assertRegex(response, 'success')
        self.assertEqual(SchoolSession.objects.get(id=school_session_object.id).workingDays, data['workingDays'])
