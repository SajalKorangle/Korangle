from parent_test import ParentTestCase

from school_app.views import get_working_days_view, create_working_days_view, update_working_days_view, get_bus_stops_view

from django.core.urlresolvers import reverse

from rest_framework.test import force_authenticate

from django.conf import settings
User = settings.AUTH_USER_MODEL

from rest_framework.test import APIRequestFactory

from school_app.model.models import SchoolSession, School, Session, BusStop

import json

class ViewsTestCase(ParentTestCase):

    def test_get_bus_stops_view(self):

        url_option = {}
        url_option['school_id'] = BusStop.objects.all()[0].parentSchool.id
        request = APIRequestFactory().get(reverse(viewname=get_bus_stops_view, kwargs=url_option))
        force_authenticate(request=request, user=User.objects.all()[0])
        response = json.loads(get_bus_stops_view(request, school_id=url_option['school_id']).content)['response']
        self.assertEqual(response['status'], 'success')


    def test_get_working_days_view(self):

        url_option = {}
        url_option['school_id'] = School.objects.all()[0].id
        url_option['session_id'] = Session.objects.all()[0].id
        request = APIRequestFactory().get(reverse(viewname=get_working_days_view, kwargs=url_option))
        force_authenticate(request=request, user=User.objects.all()[0])
        response = json.loads(get_working_days_view(request, school_id=url_option['school_id'], session_id=url_option['session_id']).content)['response']
        self.assertEqual(response['status'], 'success')

    def test_create_working_days_view(self):

        data = {}
        data['schoolDbId'] = School.objects.all()[0].id
        data['sessionDbId'] = Session.objects.all()[0].id
        data['workingDays'] = 123

        SchoolSession.objects.filter(parentSchool_id=data['schoolDbId'], parentSession_id=data['sessionDbId']).delete()

        request = APIRequestFactory().post(reverse(viewname=create_working_days_view), data=json.dumps(data), content_type='application/json')
        force_authenticate(request=request, user=User.objects.all()[0])
        response = json.loads(create_working_days_view(request).content)['response']
        self.assertEqual(response['status'], 'success')

    def test_update_working_days_view(self):

        school_object = School.objects.all()[0]

        session_object = Session.objects.all()[0]

        school_session_object = SchoolSession(parentSession=session_object, parentSchool=school_object, workingDays=12)
        school_session_object.save()

        data = {}
        data['workingDays'] = 10

        url_options = {}
        url_options['school_session_id'] = school_session_object.id

        request = APIRequestFactory().put(reverse(viewname=update_working_days_view, kwargs=url_options), data=json.dumps(data), content_type='application/json')
        force_authenticate(request=request, user=User.objects.all()[0])
        response = json.loads(update_working_days_view(request, school_session_id=url_options['school_session_id']).content)['response']
        self.assertEqual(response['status'], 'success')
        self.assertRegex(response['message'], 'success')
