'''from parent_test import ParentTestCase

from examination_app.views import get_marksheet_view, get_examination_view, \
    create_examination_view, get_maximumMarksAllowed_view, get_school_section_result_view,\
    get_section_student_result_view, create_student_result_view


from django.core.urlresolvers import reverse

from rest_framework.test import force_authenticate

from django.contrib.auth.models import User

from rest_framework.test import APIRequestFactory

from school_app.model.models import School, Session

from class_app.models import Section

import json

class ViewsTestCase(ParentTestCase):

    def test_get_maximumMarksAllowed_view(self):

        request = APIRequestFactory().get(reverse(viewname=get_maximumMarksAllowed_view))
        force_authenticate(request=request, user=User.objects.all()[0])
        response = json.loads(get_maximumMarksAllowed_view(request).content)['response']
        self.assertEqual(response['status'], 'success')

    def test_get_examination_view(self):

        # data = {}
        # data['schoolDbId'] = School.objects.all()[0].id
        # data['sessionDbId'] = Session.objects.all()[0].id
        url_option = {}
        url_option['school_id'] = School.objects.all()[0].id
        url_option['section_id'] = Section.objects.all()[0].id

        request = APIRequestFactory().post(reverse(viewname=get_examination_view, kwargs=url_option))
        force_authenticate(request=request, user=User.objects.all()[0])
        response = json.loads(get_examination_view(request, school_id=url_option['school_id'], section_id=url_option['section_id']).content)['response']
        self.assertEqual(response['status'], 'success')

    def test_create_examination_view(self):

        data = {}

        request = APIRequestFactory().put(reverse(viewname=create_examination_view), data=json.dumps(data), content_type='application/json')
        force_authenticate(request=request, user=User.objects.all()[0])
        response = json.loads(create_examination_view(request).content)['response']
        self.assertEqual(response['status'], 'success')
        self.assertRegex(response['message'], 'success')

    def test_get_marksheet_view(self):

        url_option = {}
        url_option['section_id'] = Section.objects.all()[0].id
        url_option['student_id'] = School.objects.all()[0].id

        request = APIRequestFactory().put(reverse(viewname=create_examination_view, kwargs=url_option))
        force_authenticate(request=request, user=User.objects.all()[0])
        response = json.loads(create_examination_view(request).content)['response']
        self.assertEqual(response['status'], 'success')
        self.assertRegex(response['message'], 'success')'''
