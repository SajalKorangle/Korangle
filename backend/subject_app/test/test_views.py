from parent_test import ParentTestCase

from subject_app.views import get_subjects_view

from django.core.urlresolvers import reverse

from rest_framework.test import force_authenticate

from django.conf import settings
User = settings.AUTH_USER_MODEL

from rest_framework.test import APIRequestFactory

import json

class ViewsTestCase(ParentTestCase):

    def test_get_subjects_view(self):

        request = APIRequestFactory().get(reverse(viewname=get_subjects_view))
        force_authenticate(request=request, user=User.objects.all()[0])
        response = json.loads(get_subjects_view(request).content)['response']
        self.assertEqual(response['status'], 'success')

